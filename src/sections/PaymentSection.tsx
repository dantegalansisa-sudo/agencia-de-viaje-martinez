import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import RevealText from '../components/RevealText';
import { staggerChildren, fadeInUp } from '../utils/easings';
import './PaymentSection.css';

const methods = [
  {
    icon: '💳',
    title: 'Tarjeta de Crédito/Débito',
    desc: 'Visa, Mastercard, American Express',
  },
  {
    icon: '🏦',
    title: 'Transferencia Bancaria',
    desc: 'Banreservas, Popular, BHD León, Scotiabank',
  },
  {
    icon: '💵',
    title: 'Efectivo',
    desc: 'Pesos dominicanos o dólares americanos',
  },
  {
    icon: '📱',
    title: 'Pago Móvil',
    desc: 'Tpago, ATH Móvil y otras plataformas',
  },
];

export default function PaymentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="payment" ref={ref}>
      <div className="section-container">
        <div className="payment__layout">
          <div className="payment__text">
            <span className="section-eyebrow">Formas de Pago</span>
            <RevealText tag="h2" className="section-title">
              Paga Como Prefieras
            </RevealText>
            <p className="section-subtitle">
              Aceptamos múltiples métodos de pago para tu comodidad. Reserva con solo RD$2,000 y paga el resto después.
            </p>
            <div className="payment__highlight">
              <span className="payment__highlight-icon">🔒</span>
              <div>
                <strong>Reserva segura desde RD$2,000</strong>
                <span>Bloquea tu boleto hoy y paga el saldo antes de viajar</span>
              </div>
            </div>
          </div>

          <motion.div
            className="payment__grid"
            variants={staggerChildren(0.1)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {methods.map(m => (
              <motion.div className="payment__card" key={m.title} variants={fadeInUp}>
                <span className="payment__card-icon">{m.icon}</span>
                <div>
                  <h4 className="payment__card-title">{m.title}</h4>
                  <p className="payment__card-desc">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
