import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import { useCollection } from '../hooks/useCollection';
import type { Package } from '../types';
import { staggerChildren, fadeInUp } from '../utils/easings';
import './PackagesSection.css';

const fallbackEste = [
  { resort: 'Whala Boca Chica', detail: '3 Noches', price: 'US$353' },
  { resort: 'Santo Domingo Bay', detail: 'Deluxe Ocean View · 3 Noches', price: 'US$665' },
  { resort: 'Dreams Dominicus', detail: 'Preferred Club Suite Tropical · 3 Noches', price: 'US$1,408' },
  { resort: 'Catalonia Bayahibe', detail: '3 Noches', price: 'US$1,410' },
  { resort: 'Catalonia Royal La Romana', detail: 'Deluxe Junior Suite · 3 Noches', price: 'US$1,656' },
  { resort: 'Bahia Principe Grand La Romana', detail: 'Jr. Suite Superior · 4 Noches', price: 'RD$89,709' },
];

const fallbackNorte = [
  { resort: 'Marien Puerto Plata', detail: '3 Noches', price: 'US$420' },
  { resort: 'Iberostar Waves Costa Dorada', detail: '4 Noches', price: 'RD$93,828' },
];

export default function PackagesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [zone, setZone] = useState<'este' | 'norte'>('este');
  const { data: fbPkgs } = useCollection<Package>('packages');
  const zonaEste = fbPkgs.length > 0 ? fbPkgs.filter(p => p.zone === 'este') : fallbackEste;
  const zonaNorte = fbPkgs.length > 0 ? fbPkgs.filter(p => p.zone === 'norte') : fallbackNorte;
  const items = zone === 'este' ? zonaEste : zonaNorte;

  return (
    <section className="resorts" id="resorts" ref={ref}>
      <div className="resorts__layout">
        {/* Logo flotante izquierda */}
        <div className="resorts__image-side resorts__logo-panel">
          <div className="resorts__logo-glow" />
          <img src="/imagenes/logo.png" alt="Agencia de Viajes Martínez" className="resorts__logo-float" />
          <div className="resorts__offer-badge">
            <span className="resorts__offer-badge-text">OFERTA</span>
            <span className="resorts__offer-badge-sub">Todo Incluido</span>
          </div>
        </div>

        {/* Información derecha */}
        <div className="resorts__content-side">
          <span className="section-eyebrow">Ofertas en Resorts</span>
          <RevealText tag="h2" className="section-title resorts__title">
            Ofertas Exclusivas En Resorts
          </RevealText>
          <p className="resorts__sub">
            Tarifas de 2 adultos por 3 noches · Todo incluido · Disponibilidad inmediata
          </p>

          {/* Tabs */}
          <div className="resorts__tabs">
            <button
              className={`resorts__tab ${zone === 'este' ? 'resorts__tab--active' : ''}`}
              onClick={() => setZone('este')}
            >
              Zona Este
              <span className="resorts__tab-count">{zonaEste.length}</span>
            </button>
            <button
              className={`resorts__tab ${zone === 'norte' ? 'resorts__tab--active' : ''}`}
              onClick={() => setZone('norte')}
            >
              Zona Norte
              <span className="resorts__tab-count">{zonaNorte.length}</span>
            </button>
          </div>

          {/* Offer list */}
          <motion.div
            className="resorts__list"
            variants={staggerChildren(0.07)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            key={zone}
          >
            {items.map((item, i) => (
              <motion.a
                className="offer-row"
                key={item.resort}
                variants={fadeInUp}
                href={`https://wa.me/18095293515?text=${encodeURIComponent(`Hola! Me interesa la oferta del resort ${item.resort} (${item.price})`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="offer-row__rank">{String(i + 1).padStart(2, '0')}</div>
                <div className="offer-row__info">
                  <h3 className="offer-row__name">{item.resort}</h3>
                  <span className="offer-row__detail">{item.detail}</span>
                </div>
                <div className="offer-row__right">
                  <span className="offer-row__price">{item.price}</span>
                  <span className="offer-row__cta">Reservar →</span>
                </div>
              </motion.a>
            ))}
          </motion.div>

          <p className="resorts__disclaimer">
            *Tarifas para 2 adultos · Precios en US$ o RD$ según el resort · Disponibilidad sujeta a cambio
          </p>

          <MagneticButton
            href="https://wa.me/18095293515?text=Hola!%20Quiero%20información%20sobre%20las%20ofertas%20de%20resorts."
            className="resorts__main-cta"
            target="_blank"
          >
            Consultar Disponibilidad
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
