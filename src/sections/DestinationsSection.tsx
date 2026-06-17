import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import RevealText from '../components/RevealText';
import { useCollection } from '../hooks/useCollection';
import type { Destination } from '../types';
import { staggerChildren, fadeInUp } from '../utils/easings';
import './DestinationsSection.css';

const fallbackInternational = [
  { city: 'Nueva York', country: 'Estados Unidos', code: 'JFK', price: 'Desde RD$28,000', image: '/imagenes/new york.jpg', tag: 'Más Visitado' },
  { city: 'Miami', country: 'Estados Unidos', code: 'MIA', price: 'Desde RD$18,000', image: '/imagenes/MIAMI.jpg', tag: 'Popular' },
  { city: 'Medellín', country: 'Colombia', code: 'MDE', price: 'Desde RD$19,000', image: '/imagenes/medellin.webp', tag: null },
  { city: 'Bogotá', country: 'Colombia', code: 'BOG', price: 'Desde RD$24,000', image: '/imagenes/Bogota, Kolumbia.jpg', tag: 'Vuelo + Hotel' },
  { city: 'Madrid', country: 'España', code: 'MAD', price: 'Consultar', image: '/imagenes/madrid.webp', tag: null },
  { city: 'Curazao', country: 'Antillas', code: 'CUR', price: 'Desde RD$14,000', image: '/imagenes/curazao.jpg', tag: '¡Más Barato!' },
  { city: 'Lima / Machu Picchu', country: 'Perú', code: 'LIM', price: 'Desde RD$23,000', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500&q=80', tag: null },
  { city: 'Cartagena', country: 'Colombia', code: 'CTG', price: 'Desde RD$19,000', image: '/imagenes/Cartagena de Indias, Colombia_ magic and color.webp', tag: null },
  { city: 'Costa Rica', country: 'Costa Rica', code: 'SJO', price: 'Desde RD$20,000', image: '/imagenes/Costa Rica.webp', tag: 'Sin Visa' },
  { city: 'Cancún', country: 'México', code: 'CUN', price: 'Desde RD$25,000', image: '/imagenes/Cancun.webp', tag: null },
  { city: 'San Juan', country: 'Puerto Rico', code: 'SJU', price: 'Desde RD$13,000', image: '/imagenes/san juan pr.jpg', tag: '¡Más Barato!' },
  { city: 'Chile', country: 'Chile', code: 'SCL', price: 'Desde RD$43,000', image: '/imagenes/chile.webp', tag: null },
];

const fallbackNational = [
  { city: 'Punta Cana', country: 'República Dominicana', code: 'PUJ', price: 'Desde RD$52,164', image: '/imagenes/Nickelodeon Hotel Punta Cana.jpg', tag: 'Familiar' },
  { city: 'Puerto Plata', country: 'República Dominicana', code: 'POP', price: 'Desde DOP 5,880', image: '/imagenes/Marien Puerto Plata.jpg', tag: 'Próximamente' },
];

interface Promo { id?: string; title: string; description: string; price: string; imageUrl: string; type: 'daypass' | 'tour'; order?: number; active?: boolean }

export default function DestinationsSection() {
  const [tab, setTab] = useState<'int' | 'nat' | 'daypass' | 'tour'>('int');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { data: fbDest } = useCollection<Destination>('destinations');
  const { data: fbPromos } = useCollection<Promo>('promos');
  const international = fbDest.length > 0
    ? fbDest.filter(d => d.category === 'international').map(d => ({ city: d.city, country: d.country, code: d.code, price: d.price, image: d.imageUrl, tag: d.tag }))
    : fallbackInternational;
  const national = fbDest.length > 0
    ? fbDest.filter(d => d.category === 'national').map(d => ({ city: d.city, country: d.country, code: d.code, price: d.price, image: d.imageUrl, tag: d.tag }))
    : fallbackNational;
  const dayPassPromos = fbPromos.filter(p => p.type === 'daypass');
  const tourPromos = fbPromos.filter(p => p.type === 'tour');
  const items = tab === 'int' ? international : tab === 'nat' ? national : [];

  return (
    <section className="destinations" id="destinos" ref={ref}>
      <div className="section-container">
        <span className="section-eyebrow">Destinos</span>
        <RevealText tag="h2" className="section-title">
          ¿A Dónde Quieres Viajar?
        </RevealText>
        <p className="section-subtitle">
          Vuelos ida y vuelta desde cualquier origen. Precios referenciales — consulta disponibilidad actual.
        </p>

        <div className="destinations__tabs">
          <button className={`destinations__tab ${tab === 'int' ? 'destinations__tab--active' : ''}`} onClick={() => setTab('int')}>Internacional</button>
          <button className={`destinations__tab ${tab === 'nat' ? 'destinations__tab--active' : ''}`} onClick={() => setTab('nat')}>Nacional</button>
          {dayPassPromos.length > 0 && (
            <button className={`destinations__tab ${tab === 'daypass' ? 'destinations__tab--active' : ''}`} onClick={() => setTab('daypass')}>Day Pass</button>
          )}
          {tourPromos.length > 0 && (
            <button className={`destinations__tab ${tab === 'tour' ? 'destinations__tab--active' : ''}`} onClick={() => setTab('tour')}>Tour</button>
          )}
        </div>

        {/* Destination cards (int + nat) */}
        {(tab === 'int' || tab === 'nat') && (
          <motion.div
            className="destinations__grid"
            variants={staggerChildren(0.08)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            key={tab}
          >
            {items.map((d) => (
              <motion.a
                key={d.code}
                className="dest-card"
                href={`https://wa.me/18095293515?text=${encodeURIComponent(`Hola! Me interesa viajar a ${d.city} (${d.price})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeInUp}
              >
                <img className="dest-card__img" src={d.image} alt={d.city} loading="lazy" />
                {d.tag && <span className="dest-card__tag">{d.tag}</span>}
                <div className="dest-card__body">
                  <span className="dest-card__country">{d.country}</span>
                  <h3 className="dest-card__city">{d.city}</h3>
                  <span className="dest-card__price">{d.price}</span>
                </div>
                <span className="dest-card__cta">Cotizar →</span>
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* Promo flyers (daypass + resort) */}
        {(tab === 'daypass' || tab === 'tour') && (
          <motion.div
            className="destinations__grid"
            variants={staggerChildren(0.08)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            key={tab}
          >
            {(tab === 'daypass' ? dayPassPromos : tourPromos).map((p) => (
              <motion.a
                key={p.id}
                className="dest-card dest-card--promo"
                href={`https://wa.me/18095293515?text=${encodeURIComponent(`Hola! Me interesa el ${tab === 'daypass' ? 'Day Pass' : 'Tour'}: ${p.title} ${p.price ? `(${p.price})` : ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeInUp}
              >
                <img className="dest-card__img" src={p.imageUrl} alt={p.title} loading="lazy" />
                <span className="dest-card__tag">{tab === 'daypass' ? 'Day Pass' : 'Tour'}</span>
                <div className="dest-card__body">
                  {p.price && <span className="dest-card__country">{p.price}</span>}
                  <h3 className="dest-card__city">{p.title}</h3>
                  {p.description && <span className="dest-card__price" style={{ fontSize: 11 }}>{p.description}</span>}
                </div>
                <span className="dest-card__cta">Reservar →</span>
              </motion.a>
            ))}
          </motion.div>
        )}

        <p className="section-disclaimer">
          *Precios referenciales. Sujetos a disponibilidad y cambio sin previo aviso.
        </p>
      </div>
    </section>
  );
}
