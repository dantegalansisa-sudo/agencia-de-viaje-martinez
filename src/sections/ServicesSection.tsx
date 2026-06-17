import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import RevealText from '../components/RevealText';
import { useCollection } from '../hooks/useCollection';
import type { ServiceItem } from '../types';
import { staggerChildren, fadeInUp } from '../utils/easings';
import './ServicesSection.css';

const fallbackServices = [
  { icon: '✈️', title: 'Boletos Aéreos', desc: 'Las mejores tarifas en vuelos nacionales e internacionales.' },
  { icon: '🏨', title: 'Hoteles', desc: 'Reservas en hoteles nacionales e internacionales al mejor precio.' },
  { icon: '🌍', title: 'Tours Internacionales', desc: 'Paquetes completos a los destinos más populares del mundo.' },
  { icon: '🏔️', title: 'Excursiones', desc: 'Aventuras y excursiones a destinos nacionales increíbles.' },
  { icon: '🚢', title: 'Cruceros y Ferries', desc: 'Viajes en crucero por el Caribe y más allá.' },
  { icon: '🛡️', title: 'Seguros de Viaje', desc: 'Seguros de viajes y vehículos para tu tranquilidad.' },
  { icon: '🗽', title: 'Visa Americana', desc: 'Te asistimos en todo el proceso de solicitud de visa.' },
  { icon: '📋', title: 'Formulario DS-160', desc: 'Llenado profesional del formulario de solicitud de visa.' },
  { icon: '📝', title: 'Perfil Biográfico', desc: 'Preparación completa de tu perfil para la entrevista consular.' },
  { icon: '🇪🇺', title: 'Visa ESTA', desc: 'Solicitud de autorización electrónica para viajar a Europa.' },
];

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { data: fbServices } = useCollection<ServiceItem>('services');
  const services = fbServices.length > 0 ? fbServices : fallbackServices;

  return (
    <section className="services" id="servicios" ref={ref}>
      <div className="section-container">
        <span className="section-eyebrow">Servicios</span>
        <RevealText tag="h2" className="section-title">
          Todo Lo Que Necesitas Para Tu Viaje
        </RevealText>
        <p className="section-subtitle" style={{ color: 'var(--color-text-secondary)' }}>
          Desde la planificación hasta el regreso, te acompañamos en cada paso.
        </p>

        <motion.div
          className="services__grid"
          variants={staggerChildren(0.06)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {services.map((s) => (
            <motion.div className="service-card" key={s.title} variants={fadeInUp}>
              <span className="service-card__icon">{s.icon}</span>
              <h3 className="service-card__title">{s.title}</h3>
              <p className="service-card__desc">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
