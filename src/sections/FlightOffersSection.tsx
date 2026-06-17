import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useCollection } from '../hooks/useCollection';
import type { Flight, Hotel } from '../types';
import { staggerChildren, fadeInUp } from '../utils/easings';
import './FlightOffersSection.css';

type TabKey = 'vuelos' | 'hoteles-nac' | 'hoteles-int';

const fallbackFlights = [
  { to: 'JFK', city: 'Nueva York', price: 'RD$28,000', country: 'US' },
  { to: 'MIA', city: 'Miami', price: 'RD$18,000', country: 'US' },
  { to: 'BOS', city: 'Boston', price: 'RD$19,000', country: 'US' },
  { to: 'SJU', city: 'San Juan PR', price: 'RD$13,000', country: 'PR' },
  { to: 'MDE', city: 'Medellín', price: 'RD$19,000', country: 'CO' },
  { to: 'BOG', city: 'Bogotá', price: 'RD$24,000', country: 'CO' },
  { to: 'CUR', city: 'Curazao', price: 'RD$14,000', country: 'CW' },
  { to: 'CTG', city: 'Cartagena', price: 'RD$19,000', country: 'CO' },
  { to: 'LIM', city: 'Lima', price: 'RD$23,000', country: 'PE' },
  { to: 'SJO', city: 'Costa Rica', price: 'RD$20,000', country: 'CR' },
  { to: 'CUN', city: 'Cancún', price: 'RD$25,000', country: 'MX' },
  { to: 'MAD', city: 'Madrid', price: 'Consultar', country: 'ES' },
];

const fallbackHotelesNac = [
  { name: 'Nickelodeon Resort', city: 'Punta Cana', price: 'Desde RD$52,164', stars: 5, country: 'DO' },
  { name: 'Hard Rock Hotel', city: 'Punta Cana', price: 'Desde RD$38,000', stars: 5, country: 'DO' },
  { name: 'Casa de Campo', city: 'La Romana', price: 'Desde RD$45,000', stars: 5, country: 'DO' },
  { name: 'Bahía Príncipe', city: 'Samaná', price: 'Desde RD$22,000', stars: 4, country: 'DO' },
  { name: 'Iberostar Dominicana', city: 'Punta Cana', price: 'Desde RD$28,000', stars: 5, country: 'DO' },
  { name: 'Marien Hotel', city: 'Puerto Plata', price: 'Desde RD$12,000', stars: 3, country: 'DO' },
  { name: 'Dreams Macao', city: 'Punta Cana', price: 'Desde RD$32,000', stars: 5, country: 'DO' },
  { name: 'Occidental Caribe', city: 'Punta Cana', price: 'Desde RD$18,000', stars: 4, country: 'DO' },
  { name: 'Emotions by Hodelpa', city: 'Juan Dolio', price: 'Desde RD$15,000', stars: 4, country: 'DO' },
  { name: 'Secrets Royal Beach', city: 'Punta Cana', price: 'Desde RD$42,000', stars: 5, country: 'DO' },
  { name: 'Viva Wyndham Tangerine', city: 'Cabarete', price: 'Desde RD$14,000', stars: 4, country: 'DO' },
  { name: 'Lopesan Costa Bávaro', city: 'Punta Cana', price: 'Desde RD$35,000', stars: 5, country: 'DO' },
];

const fallbackHotelesInt = [
  { name: 'Hilton Times Square', city: 'Nueva York', price: 'Consultar', stars: 4, country: 'US' },
  { name: 'Fontainebleau Miami', city: 'Miami Beach', price: 'Consultar', stars: 5, country: 'US' },
  { name: 'RIU Cancún', city: 'Cancún', price: 'Consultar', stars: 5, country: 'MX' },
  { name: 'Hotel Dann Carlton', city: 'Medellín', price: 'Consultar', stars: 4, country: 'CO' },
  { name: 'Marriott Bogotá', city: 'Bogotá', price: 'Consultar', stars: 5, country: 'CO' },
  { name: 'Hotel Meliá Madrid', city: 'Madrid', price: 'Consultar', stars: 4, country: 'ES' },
  { name: 'Hyatt Regency Orlando', city: 'Orlando', price: 'Consultar', stars: 4, country: 'US' },
  { name: 'Waldorf Astoria', city: 'Nueva York', price: 'Consultar', stars: 5, country: 'US' },
  { name: 'Decameron Cartagena', city: 'Cartagena', price: 'Consultar', stars: 4, country: 'CO' },
  { name: 'Paradisus Cancún', city: 'Cancún', price: 'Consultar', stars: 5, country: 'MX' },
  { name: 'InterContinental Madrid', city: 'Madrid', price: 'Consultar', stars: 5, country: 'ES' },
  { name: 'Sheraton Lima', city: 'Lima', price: 'Consultar', stars: 5, country: 'PE' },
];

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'vuelos', label: 'Vuelos', icon: '✈️' },
  { key: 'hoteles-nac', label: 'Hoteles Nacional', icon: '🏨' },
  { key: 'hoteles-int', label: 'Hoteles Internacional', icon: '🌍' },
];

function FlagImg({ country }: { country: string }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${country.toLowerCase()}.png`}
      alt={country}
      className="flight-row__flag-img"
      width={28}
      height={20}
      loading="lazy"
    />
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span className="hotel-row__stars">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="hotel-row__star">★</span>
      ))}
    </span>
  );
}

export default function FlightOffersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState<TabKey>('vuelos');

  const { data: fbFlights } = useCollection<Flight>('flights');
  const { data: fbHotNac } = useCollection<Hotel>('hotelsNational');
  const { data: fbHotInt } = useCollection<Hotel>('hotelsInternational');

  const flights = fbFlights.length > 0 ? fbFlights : fallbackFlights;
  const hotelesNacionales = fbHotNac.length > 0 ? fbHotNac : fallbackHotelesNac;
  const hotelesInternacionales = fbHotInt.length > 0 ? fbHotInt : fallbackHotelesInt;

  return (
    <section className="flights" id="vuelos" ref={ref}>
      <div className="section-container">
        <span className="section-eyebrow">Ofertas</span>
        <RevealText tag="h2" className="section-title">
          Vuelos y Hoteles al Mejor Precio
        </RevealText>
        <p className="section-subtitle">
          Gestionamos tu viaje desde donde te encuentres. Precios referenciales sujetos a disponibilidad.
        </p>

        {/* Tabs */}
        <div className="flights__tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`flights__tab ${activeTab === t.key ? 'flights__tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              <span className="flights__tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Vuelos tab */}
        {activeTab === 'vuelos' && (
          <motion.div
            className="flights__list"
            variants={staggerChildren(0.04)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            key="vuelos"
          >
            {flights.map((f) => (
              <motion.div className="flight-row" key={f.to} variants={fadeInUp}>
                <span className="flight-row__flag">
                  <FlagImg country={f.country} />
                </span>
                <span className="flight-row__city">{f.city}</span>
                <span className="flight-row__dest-code">{f.to}</span>
                <span className="flight-row__price">{f.price}</span>
                <MagneticButton
                  href={`https://wa.me/18095293515?text=${encodeURIComponent(`Hola! Me interesa un vuelo a ${f.city} por ${f.price}`)}`}
                  className="flight-row__cta"
                  target="_blank"
                >
                  Reservar
                </MagneticButton>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Hoteles Nacional tab */}
        {activeTab === 'hoteles-nac' && (
          <motion.div
            className="flights__list"
            variants={staggerChildren(0.04)}
            initial="hidden"
            animate="visible"
            key="hoteles-nac"
          >
            {hotelesNacionales.map((h) => (
              <motion.div className="flight-row hotel-row" key={h.name} variants={fadeInUp}>
                <span className="flight-row__flag">
                  <FlagImg country={h.country} />
                </span>
                <span className="flight-row__city">
                  <strong>{h.name}</strong>
                  <span className="hotel-row__location">{h.city}</span>
                </span>
                <Stars count={h.stars} />
                <span className="flight-row__price">{h.price}</span>
                <MagneticButton
                  href={`https://wa.me/18095293515?text=${encodeURIComponent(`Hola! Me interesa el hotel ${h.name} en ${h.city}`)}`}
                  className="flight-row__cta"
                  target="_blank"
                >
                  Cotizar
                </MagneticButton>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Hoteles Internacional tab */}
        {activeTab === 'hoteles-int' && (
          <motion.div
            className="flights__list"
            variants={staggerChildren(0.04)}
            initial="hidden"
            animate="visible"
            key="hoteles-int"
          >
            {hotelesInternacionales.map((h) => (
              <motion.div className="flight-row hotel-row" key={h.name} variants={fadeInUp}>
                <span className="flight-row__flag">
                  <FlagImg country={h.country} />
                </span>
                <span className="flight-row__city">
                  <strong>{h.name}</strong>
                  <span className="hotel-row__location">{h.city}</span>
                </span>
                <Stars count={h.stars} />
                <span className="flight-row__price">{h.price}</span>
                <MagneticButton
                  href={`https://wa.me/18095293515?text=${encodeURIComponent(`Hola! Me interesa el hotel ${h.name} en ${h.city}`)}`}
                  className="flight-row__cta"
                  target="_blank"
                >
                  Cotizar
                </MagneticButton>
              </motion.div>
            ))}
          </motion.div>
        )}

        <p className="section-disclaimer">
          *Precios referenciales sujetos a disponibilidad. Contáctanos para cotización personalizada.
        </p>
      </div>
    </section>
  );
}
