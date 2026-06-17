import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/weekly-offers', label: 'Ofertas Semanales', icon: '🔥' },
  { to: '/admin/flights', label: 'Vuelos', icon: '✈️' },
  { to: '/admin/hotels-national', label: 'Hoteles Nacional', icon: '🏨' },
  { to: '/admin/hotels-intl', label: 'Hoteles Internacional', icon: '🌍' },
  { to: '/admin/packages', label: 'Paquetes / Resorts', icon: '🏖️' },
  { to: '/admin/destinations', label: 'Destinos', icon: '📍' },
  { to: '/admin/promos', label: 'Day Pass & Tours', icon: '🏖️' },
  { to: '/admin/gallery', label: 'Galería', icon: '📸' },
  { to: '/admin/testimonials', label: 'Testimonios', icon: '⭐' },
  { to: '/admin/faqs', label: 'Preguntas Frecuentes', icon: '❓' },
  { to: '/admin/team', label: 'Equipo', icon: '👥' },
  { to: '/admin/services', label: 'Servicios', icon: '🛡️' },
  { to: '/admin/site-config', label: 'Configuración', icon: '⚙️' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada');
    navigate('/admin/login');
  };

  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin__sidebar">
        <div className="admin__sidebar-header">
          <img src="/imagenes/logo.png" alt="Agencia de Viajes Martínez" className="admin__logo" />
          <span className="admin__brand">Admin Panel</span>
        </div>

        <nav className="admin__nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin__nav-item${isActive ? ' active' : ''}`}
            >
              <span className="admin__nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin__sidebar-footer">
          <div className="admin__user">
            <span className="admin__user-email">{user?.email}</span>
          </div>
          <button className="admin__logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin__view-site">
            Ver sitio web →
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  );
}
