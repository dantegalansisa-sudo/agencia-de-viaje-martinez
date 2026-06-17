import './TrustBarSection.css';

const marqueeItems = [
  { icon: '✈', text: 'Vuelos al Mejor Precio' },
  { icon: '🏆', text: 'Agencia de Viajes Registrada' },
  { icon: '🔒', text: 'Reserva con solo RD$2,000' },
  { icon: '💬', text: 'Respuesta en menos de 5 min' },
  { icon: '⭐', text: '+5,000 Familias Confían en Nosotros' },
  { icon: '🌎', text: '+30 Destinos Disponibles' },
  { icon: '📅', text: '10 Años de Experiencia' },
  { icon: '💳', text: 'Pesos y Dólares Aceptados' },
];

const stats = [
  { value: '5,000+', label: 'Familias felices' },
  { value: '30+', label: 'Destinos' },
  { value: '10', label: 'Años experiencia' },
  { value: '<5 min', label: 'Respuesta' },
];

export default function TrustBarSection() {
  const doubled = [...marqueeItems, ...marqueeItems];

  return (
    <section className="trustbar">
      {/* Scrolling marquee */}
      <div className="trustbar__marquee">
        <div className="trustbar__track">
          {doubled.map((item, i) => (
            <div className="trustbar__item" key={i}>
              <span className="trustbar__icon">{item.icon}</span>
              <span className="trustbar__text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="trustbar__stats section-container">
        {stats.map((s, i) => (
          <div className="trustbar__stat" key={i}>
            <span className="trustbar__stat-value">{s.value}</span>
            <span className="trustbar__stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
