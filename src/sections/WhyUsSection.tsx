import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import RevealText from '../components/RevealText';
import { staggerChildren, fadeInUp } from '../utils/easings';
import './WhyUsSection.css';

const features = [
  { icon: '✈️', title: 'Expertos en Vuelos Baratos', desc: 'Encontramos las mejores tarifas para que pagues menos y viajes más.' },
  { icon: '🏆', title: 'Agencia Registrada', desc: 'Agencia de viajes legalmente registrada en la República Dominicana.' },
  { icon: '🔒', title: 'Reserva Segura desde RD$2,000', desc: 'Bloquea tu boleto ahora y paga el resto después. Sin estrés.' },
  { icon: '🌍', title: 'Destinos Nacionales e Internacionales', desc: 'Más de 15 destinos disponibles. Vuelos, hoteles, tours y más.' },
  { icon: '💼', title: 'Asesoría Personalizada', desc: 'Te ayudamos con visa, DS-160, seguros y todo lo que necesites.' },
  { icon: '📱', title: 'Atención por WhatsApp', desc: 'Respuesta rápida y cotización inmediata por WhatsApp.' },
];

export default function WhyUsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="whyus" ref={ref}>
      <div className="section-container">
        <div className="whyus__layout">
          <div className="whyus__left">
            <motion.div
              className="whyus__image"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=80"
                alt="Agencia de Viajes Martínez"
                loading="lazy"
              />
              <div className="whyus__image-badge">
                <img src="/imagenes/logo.png" alt="Martínez" className="whyus__badge-logo" />
                <div>
                  <strong>Agencia de Viajes Martínez</strong>
                  <span>Agencia Registrada</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="whyus__right">
            <span className="section-eyebrow">¿Por qué elegirnos?</span>
            <RevealText tag="h2" className="section-title">
              Tu Agencia de Viajes Confiable
            </RevealText>

            <motion.div
              className="whyus__features"
              variants={staggerChildren(0.08)}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              {features.map((f) => (
                <motion.div className="whyus__feature" key={f.title} variants={fadeInUp}>
                  <span className="whyus__feature-icon">{f.icon}</span>
                  <div>
                    <h3 className="whyus__feature-title">{f.title}</h3>
                    <p className="whyus__feature-desc">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
