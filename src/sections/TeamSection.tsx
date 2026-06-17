import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import RevealText from '../components/RevealText';
import { staggerChildren, fadeInUp } from '../utils/easings';
import './TeamSection.css';

const salesAgents = [
  { role: 'Agente de Ventas' },
  { role: 'Agente de Ventas' },
  { role: 'Agente de Ventas' },
];

export default function TeamSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="team" ref={ref}>
      <div className="section-container">
        <div className="team__header">
          <span className="section-eyebrow">Nuestro Equipo</span>
          <RevealText tag="h2" className="section-title">
            Las Personas Detrás De Tu Viaje
          </RevealText>
          <p className="section-subtitle">
            Nuestro equipo de agentes de ventas estará disponible muy pronto para ayudarte.
          </p>
        </div>

        <motion.div
          className="team__grid team__grid--soon"
          variants={staggerChildren(0.15)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {salesAgents.map((agent, i) => (
            <motion.div className="team-card team-card--soon" key={i} variants={fadeInUp}>
              <div className="team-card__soon-avatar">
                <img
                  src="/imagenes/logo.png"
                  alt="Agencia de Viajes Martínez"
                  className="team-card__soon-logo"
                  loading="lazy"
                />
              </div>
              <div className="team-card__body">
                <span className="team-card__role">{agent.role}</span>
                <span className="team-card__soon-badge">Próximamente</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
