import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useCollection } from '../hooks/useCollection';
import type { WeeklyOffer } from '../types';
import './OfferStripSection.css';

const fallback: WeeklyOffer[] = [
  { route: 'Nueva York', code: 'JFK', price: 'RD$28,000', tag: 'Más Popular', order: 0, active: true },
  { route: 'Miami', code: 'MIA', price: 'RD$18,000', tag: 'Oferta', order: 1, active: true },
  { route: 'Medellín', code: 'MDE', price: 'RD$19,000', tag: null, order: 2, active: true },
  { route: 'Curazao', code: 'CUR', price: 'RD$14,000', tag: '¡Más Barato!', order: 3, active: true },
  { route: 'Bogotá', code: 'BOG', price: 'RD$24,000', tag: null, order: 4, active: true },
];

export default function OfferStripSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { data, loading } = useCollection<WeeklyOffer>('weeklyOffers');
  const offers = data.length > 0 ? data : (loading ? [] : fallback);

  return (
    <section className="offer-strip" ref={ref}>
      <div className="section-container">
        <div className="offer-strip__header">
          <div className="offer-strip__header-left">
            <span className="offer-strip__icon">✈</span>
            <div>
              <span className="offer-strip__label">Ofertas de la Semana</span>
              <span className="offer-strip__sub">Ida y vuelta desde Santo Domingo</span>
            </div>
          </div>
          <a
            className="offer-strip__view-all"
            href="https://wa.me/18095293515?text=Hola!%20Quiero%20ver%20todas%20las%20ofertas%20de%20vuelos."
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver todas →
          </a>
        </div>

        <div className="offer-strip__grid">
          {offers.map((o, i) => (
            <motion.a
              key={o.code}
              className="offer-strip__card"
              href={`https://wa.me/18095293515?text=${encodeURIComponent(`Hola! Me interesa un vuelo a ${o.route} por ${o.price}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              {o.tag && <span className="offer-strip__tag">{o.tag}</span>}
              <div className="offer-strip__card-top">
                <span className="offer-strip__plane-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                </span>
                <div className="offer-strip__route-info">
                  <span className="offer-strip__route">{o.route}</span>
                  <span className="offer-strip__code">SDQ → {o.code}</span>
                </div>
              </div>
              <div className="offer-strip__card-bottom">
                <span className="offer-strip__price">Desde <strong>{o.price}</strong></span>
                <span className="offer-strip__cta">Cotizar →</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
