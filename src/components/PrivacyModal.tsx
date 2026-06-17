import { useEffect } from 'react';
import './PrivacyModal.css';

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="privacy-overlay" onClick={onClose}>
      <div className="privacy-modal" onClick={(e) => e.stopPropagation()}>
        <button className="privacy-modal__close" onClick={onClose} aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <h2 className="privacy-modal__title">Política de Privacidad</h2>
        <p className="privacy-modal__updated">Última actualización: 20 de marzo de 2026</p>

        <div className="privacy-modal__content">
          <section>
            <h3>1. Información que recopilamos</h3>
            <p>
              Agencia de Viajes Martínez SRL recopila información personal que usted nos proporciona voluntariamente al contactarnos
              a través de WhatsApp, correo electrónico o formularios de contacto. Esta información puede incluir:
            </p>
            <ul>
              <li>Nombre completo</li>
              <li>Número de teléfono</li>
              <li>Correo electrónico</li>
              <li>Destinos de interés y preferencias de viaje</li>
              <li>Información de pasaporte (solo cuando es necesario para reservas)</li>
            </ul>
          </section>

          <section>
            <h3>2. Uso de la información</h3>
            <p>Utilizamos su información personal exclusivamente para:</p>
            <ul>
              <li>Procesar sus reservas de vuelos, hoteles y paquetes turísticos</li>
              <li>Enviar cotizaciones y confirmaciones de viaje</li>
              <li>Comunicarnos con usted sobre sus solicitudes</li>
              <li>Informarle sobre ofertas y promociones relevantes</li>
              <li>Cumplir con requisitos legales y regulatorios</li>
            </ul>
          </section>

          <section>
            <h3>3. Protección de datos</h3>
            <p>
              Nos comprometemos a proteger su información personal. Implementamos medidas de seguridad
              apropiadas para evitar el acceso no autorizado, la divulgación, modificación o destrucción
              de sus datos personales.
            </p>
          </section>

          <section>
            <h3>4. Compartir información</h3>
            <p>
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto cuando
              sea necesario para completar su reserva (aerolíneas, hoteles, aseguradoras) o cuando la ley lo requiera.
            </p>
          </section>

          <section>
            <h3>5. Cookies y tecnologías similares</h3>
            <p>
              Nuestro sitio web puede utilizar cookies y tecnologías similares para mejorar su experiencia
              de navegación. Estas tecnologías nos ayudan a entender cómo interactúa con nuestro sitio
              y a mejorar nuestros servicios.
            </p>
          </section>

          <section>
            <h3>6. Sus derechos</h3>
            <p>Usted tiene derecho a:</p>
            <ul>
              <li>Acceder a sus datos personales que tenemos almacenados</li>
              <li>Solicitar la corrección de datos inexactos</li>
              <li>Solicitar la eliminación de sus datos personales</li>
              <li>Retirar su consentimiento en cualquier momento</li>
            </ul>
          </section>

          <section>
            <h3>7. Contacto</h3>
            <p>
              Para cualquier consulta sobre nuestra política de privacidad o para ejercer sus derechos,
              puede contactarnos a través de:
            </p>
            <ul>
              <li>WhatsApp: 809-529-3515</li>
              <li>Instagram: @agenciadeviajesmartinez</li>
              <li>Dirección: Calle Duarte #33, San Pedro de Macorís</li>
            </ul>
          </section>

          <section>
            <h3>8. Cambios en esta política</h3>
            <p>
              Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento.
              Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
