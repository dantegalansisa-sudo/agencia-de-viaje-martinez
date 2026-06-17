import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import AnimatedCounter from '../components/AnimatedCounter';
import { staggerChildren, fadeInUp } from '../utils/easings';
import './StatsSection.css';

const stats = [
  { number: 2430, suffix: '+', label: 'Seguidores Confían en Nosotros', icon: '👥' },
  { number: 15, suffix: '+', label: 'Destinos Disponibles', icon: '🌍' },
  { number: 952, suffix: '', label: 'Publicaciones de Viajes', icon: '📸' },
  { number: 10, suffix: '+', label: 'Servicios Especializados', icon: '✈️' },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="stats" ref={ref}>
      <div className="section-container">
        <motion.div
          className="stats__grid"
          variants={staggerChildren(0.1)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {stats.map((s) => (
            <motion.div className="stats__item" key={s.label} variants={fadeInUp}>
              <span className="stats__icon">{s.icon}</span>
              <AnimatedCounter
                target={s.number}
                suffix={s.suffix}
                className="stats__number"
              />
              <span className="stats__label">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
