import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RevealText from '../components/RevealText';
import { useCollection } from '../hooks/useCollection';
import type { FAQ } from '../types';
import './FAQSection.css';

const fallbackFaqs = [
  {
    q: '¿Cómo puedo reservar un vuelo?',
    a: 'Usa nuestro buscador de vuelos en la portada o escríbenos directamente por WhatsApp al 809-529-3515. Te enviamos la cotización en menos de 5 minutos y puedes reservar con solo RD$2,000.',
  },
  {
    q: '¿Cuánto debo pagar para bloquear un boleto?',
    a: 'Puedes bloquear tu boleto con un depósito de solo RD$2,000. El saldo restante lo pagas antes de la fecha de viaje según el acuerdo con tu agente.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), transferencias bancarias (Banreservas, Popular, BHD León), efectivo en pesos o dólares, y pagos móviles (Tpago).',
  },
  {
    q: '¿Me ayudan con la Visa Americana?',
    a: 'Sí, ofrecemos asistencia completa: llenado del formulario DS-160, preparación del perfil biográfico, orientación para la entrevista consular y seguimiento del proceso.',
  },
  {
    q: '¿Los precios incluyen maleta?',
    a: 'Depende de la aerolínea y tarifa. En tu cotización te indicamos si incluye maleta o no, y el costo adicional si aplica. Puedes solicitar "Incluir maleta" en el buscador.',
  },
  {
    q: '¿Puedo cambiar o cancelar mi reserva?',
    a: 'Las políticas de cambio y cancelación dependen de la aerolínea y tipo de tarifa. Te explicamos las condiciones antes de confirmar tu compra para que tomes la mejor decisión.',
  },
  {
    q: '¿Ofrecen paquetes todo incluido?',
    a: 'Sí, tenemos paquetes nacionales todo incluido en resorts de Punta Cana, Puerto Plata, La Romana y más. También armamos paquetes internacionales a medida (vuelo + hotel).',
  },
  {
    q: '¿Cuál es el horario de atención?',
    a: 'Atendemos de lunes a sábado de 9:00 AM a 7:00 PM por WhatsApp. Mensajes fuera de horario son respondidos a primera hora del siguiente día laborable.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { data: fbFaqs } = useCollection<FAQ>('faqs');
  const faqs = (fbFaqs.length > 0 ? fbFaqs : fallbackFaqs).map(f => ({ q: 'question' in f ? (f as FAQ).question : (f as { q: string }).q, a: 'answer' in f ? (f as FAQ).answer : (f as { a: string }).a }));

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="faq" id="faq">
      <div className="section-container">
        <span className="section-eyebrow">Preguntas Frecuentes</span>
        <RevealText tag="h2" className="section-title">
          ¿Tienes Dudas? Aquí Las Respondemos
        </RevealText>
        <p className="section-subtitle">
          Las respuestas a las preguntas más comunes de nuestros viajeros.
        </p>

        <div className="faq__list">
          {faqs.map((faq, i) => (
            <div
              className={`faq__item${openIndex === i ? ' faq__item--open' : ''}`}
              key={i}
            >
              <button className="faq__question" onClick={() => toggle(i)}>
                <span>{faq.q}</span>
                <span className="faq__icon">{openIndex === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    className="faq__answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
