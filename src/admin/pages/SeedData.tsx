import { useState } from 'react';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';

const weeklyOffers = [
  { route: 'Nueva York', code: 'JFK', price: 'RD$28,000', tag: 'Más Popular', order: 0, active: true },
  { route: 'Miami', code: 'MIA', price: 'RD$18,000', tag: 'Oferta', order: 1, active: true },
  { route: 'Medellín', code: 'MDE', price: 'RD$19,000', tag: null, order: 2, active: true },
  { route: 'Curazao', code: 'CUR', price: 'RD$14,000', tag: '¡Más Barato!', order: 3, active: true },
  { route: 'Bogotá', code: 'BOG', price: 'RD$24,000', tag: null, order: 4, active: true },
];

const flights = [
  { city: 'Nueva York', to: 'JFK', price: 'RD$28,000', country: 'US', order: 0, active: true },
  { city: 'Miami', to: 'MIA', price: 'RD$18,000', country: 'US', order: 1, active: true },
  { city: 'Orlando', to: 'MCO', price: 'RD$22,000', country: 'US', order: 2, active: true },
  { city: 'Boston', to: 'BOS', price: 'RD$32,000', country: 'US', order: 3, active: true },
  { city: 'Medellín', to: 'MDE', price: 'RD$19,000', country: 'CO', order: 4, active: true },
  { city: 'Bogotá', to: 'BOG', price: 'RD$24,000', country: 'CO', order: 5, active: true },
  { city: 'Madrid', to: 'MAD', price: 'Consultar', country: 'ES', order: 6, active: true },
  { city: 'Curazao', to: 'CUR', price: 'RD$14,000', country: 'CW', order: 7, active: true },
  { city: 'Cartagena', to: 'CTG', price: 'RD$19,000', country: 'CO', order: 8, active: true },
  { city: 'Costa Rica', to: 'SJO', price: 'RD$20,000', country: 'CR', order: 9, active: true },
  { city: 'Cancún', to: 'CUN', price: 'RD$25,000', country: 'MX', order: 10, active: true },
  { city: 'San Juan PR', to: 'SJU', price: 'RD$13,000', country: 'PR', order: 11, active: true },
];

const hotelsNational = [
  { name: 'Nickelodeon Resort', city: 'Punta Cana', price: 'Desde RD$52,164', stars: 5, country: 'DO', order: 0, active: true },
  { name: 'Hard Rock Hotel', city: 'Punta Cana', price: 'Desde RD$38,000', stars: 5, country: 'DO', order: 1, active: true },
  { name: 'Casa de Campo', city: 'La Romana', price: 'Desde RD$45,000', stars: 5, country: 'DO', order: 2, active: true },
  { name: 'Bahía Príncipe', city: 'Samaná', price: 'Desde RD$22,000', stars: 4, country: 'DO', order: 3, active: true },
  { name: 'Iberostar Dominicana', city: 'Punta Cana', price: 'Desde RD$28,000', stars: 5, country: 'DO', order: 4, active: true },
  { name: 'Marien Hotel', city: 'Puerto Plata', price: 'Desde RD$12,000', stars: 3, country: 'DO', order: 5, active: true },
  { name: 'Dreams Macao', city: 'Punta Cana', price: 'Desde RD$32,000', stars: 5, country: 'DO', order: 6, active: true },
  { name: 'Occidental Caribe', city: 'Punta Cana', price: 'Desde RD$18,000', stars: 4, country: 'DO', order: 7, active: true },
  { name: 'Emotions by Hodelpa', city: 'Juan Dolio', price: 'Desde RD$15,000', stars: 4, country: 'DO', order: 8, active: true },
  { name: 'Secrets Royal Beach', city: 'Punta Cana', price: 'Desde RD$42,000', stars: 5, country: 'DO', order: 9, active: true },
  { name: 'Viva Wyndham Tangerine', city: 'Cabarete', price: 'Desde RD$14,000', stars: 4, country: 'DO', order: 10, active: true },
  { name: 'Lopesan Costa Bávaro', city: 'Punta Cana', price: 'Desde RD$35,000', stars: 5, country: 'DO', order: 11, active: true },
];

const hotelsInternational = [
  { name: 'Hilton Times Square', city: 'Nueva York', price: 'Consultar', stars: 4, country: 'US', order: 0, active: true },
  { name: 'Fontainebleau Miami', city: 'Miami Beach', price: 'Consultar', stars: 5, country: 'US', order: 1, active: true },
  { name: 'RIU Cancún', city: 'Cancún', price: 'Consultar', stars: 5, country: 'MX', order: 2, active: true },
  { name: 'Hotel Dann Carlton', city: 'Medellín', price: 'Consultar', stars: 4, country: 'CO', order: 3, active: true },
  { name: 'Marriott Bogotá', city: 'Bogotá', price: 'Consultar', stars: 5, country: 'CO', order: 4, active: true },
  { name: 'Hotel Meliá Madrid', city: 'Madrid', price: 'Consultar', stars: 4, country: 'ES', order: 5, active: true },
  { name: 'Hyatt Regency Orlando', city: 'Orlando', price: 'Consultar', stars: 4, country: 'US', order: 6, active: true },
  { name: 'Waldorf Astoria', city: 'Nueva York', price: 'Consultar', stars: 5, country: 'US', order: 7, active: true },
  { name: 'Decameron Cartagena', city: 'Cartagena', price: 'Consultar', stars: 4, country: 'CO', order: 8, active: true },
  { name: 'Paradisus Cancún', city: 'Cancún', price: 'Consultar', stars: 5, country: 'MX', order: 9, active: true },
  { name: 'InterContinental Madrid', city: 'Madrid', price: 'Consultar', stars: 5, country: 'ES', order: 10, active: true },
  { name: 'Sheraton Lima', city: 'Lima', price: 'Consultar', stars: 5, country: 'PE', order: 11, active: true },
];

const packages = [
  { resort: 'Whala Boca Chica', detail: '3 Noches', price: 'US$353', zone: 'este', order: 0, active: true },
  { resort: 'Santo Domingo Bay', detail: 'Deluxe Ocean View · 3 Noches', price: 'US$665', zone: 'este', order: 1, active: true },
  { resort: 'Dreams Dominicus', detail: 'Preferred Club Suite Tropical · 3 Noches', price: 'US$1,408', zone: 'este', order: 2, active: true },
  { resort: 'Catalonia Bayahibe', detail: '3 Noches', price: 'US$1,410', zone: 'este', order: 3, active: true },
  { resort: 'Catalonia Royal La Romana', detail: 'Deluxe Junior Suite · 3 Noches', price: 'US$1,656', zone: 'este', order: 4, active: true },
  { resort: 'Bahia Principe Grand La Romana', detail: 'Jr. Suite Superior · 4 Noches', price: 'RD$89,709', zone: 'este', order: 5, active: true },
  { resort: 'Marien Puerto Plata', detail: '3 Noches', price: 'US$420', zone: 'norte', order: 6, active: true },
  { resort: 'Iberostar Waves Costa Dorada', detail: '4 Noches', price: 'RD$93,828', zone: 'norte', order: 7, active: true },
];

const destinations = [
  { city: 'Nueva York', country: 'Estados Unidos', code: 'JFK', price: 'Desde RD$28,000', imageUrl: '/imagenes/new york.jpg', tag: 'Más Visitado', category: 'international', order: 0, active: true },
  { city: 'Miami', country: 'Estados Unidos', code: 'MIA', price: 'Desde RD$18,000', imageUrl: '/imagenes/MIAMI.jpg', tag: 'Popular', category: 'international', order: 1, active: true },
  { city: 'Medellín', country: 'Colombia', code: 'MDE', price: 'Desde RD$19,000', imageUrl: '/imagenes/medellin.webp', tag: null, category: 'international', order: 2, active: true },
  { city: 'Bogotá', country: 'Colombia', code: 'BOG', price: 'Desde RD$24,000', imageUrl: '/imagenes/Bogota, Kolumbia.jpg', tag: 'Vuelo + Hotel', category: 'international', order: 3, active: true },
  { city: 'Madrid', country: 'España', code: 'MAD', price: 'Consultar', imageUrl: '/imagenes/madrid.webp', tag: null, category: 'international', order: 4, active: true },
  { city: 'Curazao', country: 'Antillas', code: 'CUR', price: 'Desde RD$14,000', imageUrl: '/imagenes/curazao.jpg', tag: '¡Más Barato!', category: 'international', order: 5, active: true },
  { city: 'Lima / Machu Picchu', country: 'Perú', code: 'LIM', price: 'Desde RD$23,000', imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500&q=80', tag: null, category: 'international', order: 6, active: true },
  { city: 'Cartagena', country: 'Colombia', code: 'CTG', price: 'Desde RD$19,000', imageUrl: '/imagenes/Cartagena de Indias, Colombia_ magic and color.webp', tag: null, category: 'international', order: 7, active: true },
  { city: 'Costa Rica', country: 'Costa Rica', code: 'SJO', price: 'Desde RD$20,000', imageUrl: '/imagenes/Costa Rica.webp', tag: 'Sin Visa', category: 'international', order: 8, active: true },
  { city: 'Cancún', country: 'México', code: 'CUN', price: 'Desde RD$25,000', imageUrl: '/imagenes/Cancun.webp', tag: null, category: 'international', order: 9, active: true },
  { city: 'San Juan', country: 'Puerto Rico', code: 'SJU', price: 'Desde RD$13,000', imageUrl: '/imagenes/san juan pr.jpg', tag: '¡Más Barato!', category: 'international', order: 10, active: true },
  { city: 'Chile', country: 'Chile', code: 'SCL', price: 'Desde RD$43,000', imageUrl: '/imagenes/chile.webp', tag: null, category: 'international', order: 11, active: true },
  { city: 'Punta Cana', country: 'República Dominicana', code: 'PUJ', price: 'Desde RD$52,164', imageUrl: '/imagenes/Nickelodeon Hotel Punta Cana.jpg', tag: 'Familiar', category: 'national', order: 12, active: true },
  { city: 'Puerto Plata', country: 'República Dominicana', code: 'POP', price: 'Desde DOP 5,880', imageUrl: '/imagenes/Marien Puerto Plata.jpg', tag: 'Próximamente', category: 'national', order: 13, active: true },
];

const testimonials = [
  { name: 'Carmen Rodríguez', initials: 'CR', location: 'San Pedro de Macorís', destination: 'Voló a Miami', text: 'Martínez me consiguió el vuelo más barato que encontré. El proceso fue súper fácil por WhatsApp y me ayudaron con todo. ¡Ya reservé mi segundo viaje con ellos!', rating: 5, order: 0, active: true },
  { name: 'Ramón García', initials: 'RG', location: 'Santo Domingo', destination: 'Viajó a Medellín', text: 'Bloquée mi boleto con solo RD$2,000 y pagué el resto después. Excelente servicio, muy profesionales. Mi familia quedó encantada con el viaje.', rating: 5, order: 1, active: true },
  { name: 'Yolanda Mercedes', initials: 'YM', location: 'Santo Domingo Norte', destination: 'Paquete Punta Cana', text: 'Llevé a mis hijos a Punta Cana con el paquete que me recomendaron. Todo perfecto, hotel hermoso y el precio fue increíble. 100% recomendada.', rating: 5, order: 2, active: true },
];

const faqs = [
  { question: '¿Cómo puedo reservar un vuelo?', answer: 'Usa nuestro buscador de vuelos en la portada o escríbenos directamente por WhatsApp al 809-529-3515. Te enviamos la cotización en menos de 5 minutos y puedes reservar con solo RD$2,000.', order: 0, active: true },
  { question: '¿Cuánto debo pagar para bloquear un boleto?', answer: 'Puedes bloquear tu boleto con un depósito de solo RD$2,000. El saldo restante lo pagas antes de la fecha de viaje según el acuerdo con tu agente.', order: 1, active: true },
  { question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), transferencias bancarias (Banreservas, Popular, BHD León), efectivo en pesos o dólares, y pagos móviles (Tpago).', order: 2, active: true },
  { question: '¿Me ayudan con la Visa Americana?', answer: 'Sí, ofrecemos asistencia completa: llenado del formulario DS-160, preparación del perfil biográfico, orientación para la entrevista consular y seguimiento del proceso.', order: 3, active: true },
  { question: '¿Los precios incluyen maleta?', answer: 'Depende de la aerolínea y tarifa. En tu cotización te indicamos si incluye maleta o no, y el costo adicional si aplica.', order: 4, active: true },
  { question: '¿Puedo cambiar o cancelar mi reserva?', answer: 'Las políticas de cambio y cancelación dependen de la aerolínea y tipo de tarifa. Te explicamos las condiciones antes de confirmar tu compra.', order: 5, active: true },
  { question: '¿Ofrecen paquetes todo incluido?', answer: 'Sí, tenemos paquetes nacionales todo incluido en resorts de Punta Cana, Puerto Plata, La Romana y más. También armamos paquetes internacionales a medida.', order: 6, active: true },
  { question: '¿Cuál es el horario de atención?', answer: 'Atendemos de lunes a sábado de 9:00 AM a 7:00 PM por WhatsApp. Mensajes fuera de horario son respondidos a primera hora del siguiente día laborable.', order: 7, active: true },
];

const services = [
  { icon: '✈️', title: 'Boletos Aéreos', desc: 'Las mejores tarifas en vuelos nacionales e internacionales.', order: 0, active: true },
  { icon: '🏨', title: 'Hoteles', desc: 'Reservas en hoteles nacionales e internacionales al mejor precio.', order: 1, active: true },
  { icon: '🌍', title: 'Tours Internacionales', desc: 'Paquetes completos a los destinos más populares del mundo.', order: 2, active: true },
  { icon: '🏔️', title: 'Excursiones', desc: 'Aventuras y excursiones a destinos nacionales increíbles.', order: 3, active: true },
  { icon: '🚢', title: 'Cruceros y Ferries', desc: 'Viajes en crucero por el Caribe y más allá.', order: 4, active: true },
  { icon: '🛡️', title: 'Seguros de Viaje', desc: 'Seguros de viajes y vehículos para tu tranquilidad.', order: 5, active: true },
  { icon: '🗽', title: 'Visa Americana', desc: 'Te asistimos en todo el proceso de solicitud de visa.', order: 6, active: true },
  { icon: '📋', title: 'Formulario DS-160', desc: 'Llenado profesional del formulario de solicitud de visa.', order: 7, active: true },
  { icon: '📝', title: 'Perfil Biográfico', desc: 'Preparación completa de tu perfil para la entrevista consular.', order: 8, active: true },
  { icon: '🇪🇺', title: 'Visa ESTA', desc: 'Solicitud de autorización electrónica para viajar a Europa.', order: 9, active: true },
];

const teamMembers = [
  { name: 'Jesús de la Cruz Disla', role: 'Presidente', bio: 'Empresario y líder estratégico de Agencia de Viajes Martínez. Dirige con visión el crecimiento de la agencia y la expansión de destinos.', imageUrl: '', instagram: '@agenciadeviajesmartinez', isLeadership: true, leadershipGroupImage: '/imagenes/presidente-vicepresidenta.jpeg', order: 0, active: true },
  { name: 'Maridania Gerbacio', role: 'Vicepresidenta', bio: 'Mercadóloga y líder organizacional de Agencia de Viajes Martínez. Se destaca por su liderazgo en la optimización de procesos.', imageUrl: '', instagram: '@agenciadeviajesmartinez', isLeadership: true, leadershipGroupImage: '/imagenes/presidente-vicepresidenta.jpeg', order: 1, active: true },
  { name: 'Yudelka Mejía', role: 'Encargada de Operaciones', bio: 'Pilar fundamental en el día a día de la agencia, se encarga de la atención personalizada a cada cliente.', imageUrl: '/imagenes/encargada.jpeg', instagram: '@agenciadeviajesmartinez', isLeadership: false, leadershipGroupImage: null, order: 2, active: true },
];

const heroConfig = {
  title: 'Cotiza Tu Vuelo', titleAccent: 'Al Mejor Precio',
  subtitle: 'Vuelos, hoteles, paquetes y cruceros desde República Dominicana al mundo.',
  badgeText: 'Agencia de Viajes Registrada', videoUrl: '',
  trustItems: ['Respuesta en menos de 5 min', 'Precio garantizado', 'Pago en pesos o dólares'],
};

const contactConfig = {
  whatsappPrimary: '18095293515', whatsappSecondary: '18095293515',
  email: '',
  address: 'Calle Duarte #33, San Pedro de Macorís, Rep. Dom.',
  instagram: '@agenciadeviajesmartinez',
};

const seedCollections: { name: string; data: Record<string, unknown>[] }[] = [
  { name: 'weeklyOffers', data: weeklyOffers },
  { name: 'flights', data: flights },
  { name: 'hotelsNational', data: hotelsNational },
  { name: 'hotelsInternational', data: hotelsInternational },
  { name: 'packages', data: packages },
  { name: 'destinations', data: destinations },
  { name: 'testimonials', data: testimonials },
  { name: 'faqs', data: faqs },
  { name: 'services', data: services },
  { name: 'team', data: teamMembers },
];

export default function SeedData() {
  const [seeding, setSeeding] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const seedAll = async () => {
    setSeeding(true);
    setResults([]);
    const log: string[] = [];

    for (const { name, data } of seedCollections) {
      const snap = await getDocs(collection(db, name));
      if (snap.size > 0) {
        log.push(`⏭️ ${name}: ya tiene ${snap.size} docs, saltado`);
        setResults([...log]);
        continue;
      }
      for (const item of data) {
        await addDoc(collection(db, name), item);
      }
      log.push(`✅ ${name}: ${data.length} documentos creados`);
      setResults([...log]);
    }

    // Site config (single documents)
    try {
      await setDoc(doc(db, 'siteConfig', 'hero'), heroConfig, { merge: true });
      log.push('✅ siteConfig/hero: guardado');
      await setDoc(doc(db, 'siteConfig', 'contact'), contactConfig, { merge: true });
      log.push('✅ siteConfig/contact: guardado');
    } catch {
      log.push('⚠️ siteConfig: error al guardar');
    }

    setResults([...log]);
    setSeeding(false);
    toast.success('Seed completado');
  };

  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">Seed Data</h1>
        <p className="admin-page__sub">Migrar TODOS los datos hardcoded a Firestore. Colecciones que ya tienen datos se saltan.</p>
      </div>

      <button className="adm-btn adm-btn--primary" onClick={seedAll} disabled={seeding}>
        {seeding ? 'Sembrando datos...' : 'Sembrar TODOS los Datos a Firestore'}
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: 24 }}>
          {results.map((r, i) => (
            <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{r}</p>
          ))}
        </div>
      )}
    </div>
  );
}
