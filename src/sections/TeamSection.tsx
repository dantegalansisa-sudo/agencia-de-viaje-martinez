import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import RevealText from '../components/RevealText';
import { useCollection } from '../hooks/useCollection';
import type { TeamMember } from '../types';
import { staggerChildren, fadeInUp } from '../utils/easings';
import './TeamSection.css';

const fallbackLeadership = {
  image: '/imagenes/presidente-vicepresidenta.jpeg',
  members: [
    {
      name: 'Jesús de la Cruz Disla',
      role: 'Presidente',
      bio: 'Empresario y líder estratégico de Agencia de Viajes Martínez. Dirige con visión el crecimiento de la agencia y la expansión de destinos. Su enfoque está en posicionar a Martínez como referente nacional e internacional, ofreciendo viajes confiables y de calidad. Trabaja para conectar a más clientes con nuevas oportunidades alrededor del mundo.',
    },
    {
      name: 'Maridania Gerbacio',
      role: 'Vicepresidenta',
      bio: 'Mercadóloga y líder organizacional de Agencia de Viajes Martínez. Se destaca por su liderazgo en la optimización de procesos e impulsa iniciativas que fortalecen la experiencia del viajero. Su gestión promueve una agencia eficiente y en constante crecimiento.',
    },
  ],
  instagram: '@agenciadeviajesmartinez',
};

const fallbackTeam = [
  {
    name: 'Yudelka Mejía',
    role: 'Encargada de Operaciones',
    image: '/imagenes/encargada.jpeg',
    bio: 'Pilar fundamental en el día a día de la agencia, se encarga de la atención personalizada a cada cliente, coordinación de reservas y logística de viajes. Su compromiso con el servicio al cliente garantiza que cada viajero reciba una experiencia excepcional desde la cotización hasta el regreso. Siempre disponible para ayudarte a planificar tu próxima aventura.',
    instagram: '@agenciadeviajesmartinez',
  },
];

export default function TeamSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data: fbTeam } = useCollection<TeamMember>('team');
  const leaderMembers = fbTeam.filter(m => m.isLeadership);
  const regularMembers = fbTeam.filter(m => !m.isLeadership);
  const hasFirebaseTeam = fbTeam.length > 0;

  const leadership = hasFirebaseTeam && leaderMembers.length > 0
    ? { image: leaderMembers[0]?.leadershipGroupImage || leaderMembers[0]?.imageUrl || '', members: leaderMembers.map(m => ({ name: m.name, role: m.role, bio: m.bio })), instagram: leaderMembers[0]?.instagram || '' }
    : fallbackLeadership;
  const team = hasFirebaseTeam
    ? regularMembers.map(m => ({ name: m.name, role: m.role, image: m.imageUrl, bio: m.bio, instagram: m.instagram }))
    : fallbackTeam;

  return (
    <section className="team" ref={ref}>
      <div className="section-container">
        <div className="team__header">
          <span className="section-eyebrow">Nuestro Equipo</span>
          <RevealText tag="h2" className="section-title">
            Las Personas Detrás De Tu Viaje
          </RevealText>
          <p className="section-subtitle">
            Conoce a quienes hacen posible que cada experiencia sea inolvidable.
          </p>
        </div>

        <motion.div
          className="team__content"
          variants={staggerChildren(0.2)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Leadership card — foto compartida */}
          <motion.div className="team-card team-card--leadership" variants={fadeInUp}>
            <div className="team-card__image-wrap">
              <img
                src={leadership.image}
                alt="Presidente y Vicepresidenta de Agencia de Viajes Martínez"
                className="team-card__image"
                loading="lazy"
              />
              <div className="team-card__image-accent" />
            </div>
            <div className="team-card__body">
              {leadership.members.map((m) => (
                <div className="team-card__member" key={m.name}>
                  <span className="team-card__role">{m.role}</span>
                  <h3 className="team-card__name">{m.name}</h3>
                  <p className="team-card__bio">{m.bio}</p>
                </div>
              ))}
              <a
                href={`https://instagram.com/${leadership.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card__social"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                {leadership.instagram}
              </a>
            </div>
          </motion.div>

          {/* Other team members */}
          <div className="team__grid">
            {team.map((member) => (
              <motion.div className="team-card" key={member.name} variants={fadeInUp}>
                <div className="team-card__image-wrap">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-card__image"
                    loading="lazy"
                  />
                  <div className="team-card__image-accent" />
                </div>
                <div className="team-card__body">
                  <span className="team-card__role">{member.role}</span>
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__bio">{member.bio}</p>
                  <a
                    href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-card__social"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    {member.instagram}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
