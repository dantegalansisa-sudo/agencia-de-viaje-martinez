import { Link } from 'react-router-dom';

const sections = [
  { to: '/admin/weekly-offers', icon: '🔥', title: 'Ofertas Semanales', desc: 'Precios y rutas destacadas' },
  { to: '/admin/flights', icon: '✈️', title: 'Vuelos', desc: 'Precios de vuelos' },
  { to: '/admin/hotels-national', icon: '🏨', title: 'Hoteles Nacional', desc: 'Hoteles en RD' },
  { to: '/admin/hotels-intl', icon: '🌍', title: 'Hoteles Internacional', desc: 'Hoteles fuera de RD' },
  { to: '/admin/packages', icon: '🏖️', title: 'Paquetes / Resorts', desc: 'Ofertas todo incluido' },
  { to: '/admin/destinations', icon: '📍', title: 'Destinos', desc: 'Tarjetas de destino con fotos' },
  { to: '/admin/gallery', icon: '📸', title: 'Galería', desc: 'Fotos de viajes' },
  { to: '/admin/testimonials', icon: '⭐', title: 'Testimonios', desc: 'Reseñas de clientes' },
  { to: '/admin/faqs', icon: '❓', title: 'Preguntas Frecuentes', desc: 'FAQ del sitio' },
  { to: '/admin/team', icon: '👥', title: 'Equipo', desc: 'Miembros del equipo' },
  { to: '/admin/services', icon: '🛡️', title: 'Servicios', desc: 'Lista de servicios' },
  { to: '/admin/site-config', icon: '⚙️', title: 'Configuración', desc: 'Hero, contacto y más' },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">Dashboard</h1>
        <p className="admin-page__sub">Administra todo el contenido de myjtravels.com</p>
      </div>

      <div className="admin-dash__grid">
        {sections.map(s => (
          <Link key={s.to} to={s.to} className="admin-dash__card">
            <div className="admin-dash__card-icon">{s.icon}</div>
            <div className="admin-dash__card-info">
              <div className="admin-dash__card-title">{s.title}</div>
              <div className="admin-dash__card-count">{s.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
