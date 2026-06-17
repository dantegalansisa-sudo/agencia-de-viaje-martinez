import { useState } from 'react';
import MagneticButton from '../components/MagneticButton';
import PrivacyModal from '../components/PrivacyModal';
import './FooterSection.css';

const destLinks = [
  'Nueva York', 'Miami', 'Medellín', 'Bogotá', 'Madrid',
  'Curazao', 'Punta Cana', 'Costa Rica',
];

const serviceLinks = [
  'Boletos Aéreos', 'Hoteles', 'Tours', 'Cruceros',
  'Visa Americana', 'DS-160', 'Seguros',
];

export default function FooterSection() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo-row">
              <img src="/imagenes/logo.png" alt="Agencia de Viajes Martínez" className="footer__logo" />
            </div>
            <p className="footer__tagline">
              Tu agencia confiable — Haz de cada viaje una experiencia inolvidable.
            </p>
            <div className="footer__social">
              <MagneticButton
                href="https://instagram.com/agenciadeviajesmartinez"
                className="footer__social-link"
                target="_blank"
              >
                Instagram
              </MagneticButton>
              <MagneticButton
                href="https://wa.me/18095293515"
                className="footer__social-link"
                target="_blank"
              >
                WhatsApp
              </MagneticButton>
            </div>
          </div>

          {/* Destinations */}
          <div className="footer__col">
            <h4 className="footer__col-title">Destinos</h4>
            <ul className="footer__links">
              {destLinks.map((d) => (
                <li key={d}>
                  <a href={`https://wa.me/18095293515?text=${encodeURIComponent(`Hola! Me interesa volar a ${d}`)}`} target="_blank" rel="noopener noreferrer">{d}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer__col">
            <h4 className="footer__col-title">Servicios</h4>
            <ul className="footer__links">
              {serviceLinks.map((s) => (
                <li key={s}><a href="#servicios">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contacto</h4>
            <ul className="footer__links">
              <li><a href="https://wa.me/18095293515" target="_blank" rel="noopener noreferrer">809-529-3515</a></li>
              <li><a href="https://instagram.com/agenciadeviajesmartinez" target="_blank" rel="noopener noreferrer">@agenciadeviajesmartinez</a></li>
              <li><span>Calle Duarte #33, San Pedro de Macorís</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__cesdn">
          Agencia de viajes legalmente registrada en la República Dominicana.
        </div>

        <div className="footer__bottom">
          <span>&copy; 2026 Agencia de Viajes Martínez SRL. Todos los derechos reservados.</span>
          <span>Diseñado por <a href="https://instagram.com/nexixtech" target="_blank" rel="noopener noreferrer">NEXIX Tech Studio</a></span>
        </div>

        <div className="footer__legal">
          <button className="footer__legal-link" onClick={() => setPrivacyOpen(true)}>
            Política de Privacidad
          </button>
        </div>
      </div>

      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  );
}
