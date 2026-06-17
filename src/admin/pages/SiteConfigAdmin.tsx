import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';
import type { HeroConfig, ContactConfig } from '../../types';

const defaultHero: HeroConfig = {
  title: 'Cotiza Tu Vuelo', titleAccent: 'Al Mejor Precio',
  subtitle: 'Vuelos, hoteles, paquetes y cruceros desde República Dominicana al mundo.',
  badgeText: 'Agencia de Viajes Registrada', videoUrl: '',
  trustItems: ['Respuesta en menos de 5 min', 'Precio garantizado', 'Pago en pesos o dólares'],
};

const defaultContact: ContactConfig = {
  whatsappPrimary: '18095293515', whatsappSecondary: '18095293515',
  email: '', address: 'Calle Duarte #33, San Pedro de Macorís, Rep. Dom.',
  instagram: '@agenciadeviajesmartinez',
};

export default function SiteConfigAdmin() {
  const [hero, setHero] = useState<HeroConfig>(defaultHero);
  const [contact, setContact] = useState<ContactConfig>(defaultContact);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const heroSnap = await getDoc(doc(db, 'siteConfig', 'hero'));
      if (heroSnap.exists()) setHero(heroSnap.data() as HeroConfig);
      const contactSnap = await getDoc(doc(db, 'siteConfig', 'contact'));
      if (contactSnap.exists()) setContact(contactSnap.data() as ContactConfig);
      setLoading(false);
    })();
  }, []);

  const saveHero = async () => {
    try { await setDoc(doc(db, 'siteConfig', 'hero'), hero); toast.success('Hero guardado'); } catch { toast.error('Error'); }
  };

  const saveContact = async () => {
    try { await setDoc(doc(db, 'siteConfig', 'contact'), contact); toast.success('Contacto guardado'); } catch { toast.error('Error'); }
  };

  if (loading) return <div className="adm-loading">Cargando...</div>;

  return (
    <div>
      <div className="admin-page__header"><h1 className="admin-page__title">Configuración del Sitio</h1><p className="admin-page__sub">Hero, contacto y textos generales</p></div>

      {/* Hero */}
      <div style={{ background: '#111d35', borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Hero / Portada</h3>
        <div className="adm-form-row">
          <div className="adm-field"><label>Título</label><input value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} /></div>
          <div className="adm-field"><label>Texto destacado (verde)</label><input value={hero.titleAccent} onChange={e => setHero({ ...hero, titleAccent: e.target.value })} /></div>
        </div>
        <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Subtítulo</label><input value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} /></div></div>
        <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Badge</label><input value={hero.badgeText} onChange={e => setHero({ ...hero, badgeText: e.target.value })} /></div></div>
        <div className="adm-form-row adm-form-row--full">
          <div className="adm-field"><label>Trust items (separados por |)</label>
            <input value={hero.trustItems.join(' | ')} onChange={e => setHero({ ...hero, trustItems: e.target.value.split('|').map(s => s.trim()).filter(Boolean) })} />
          </div>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={saveHero} style={{ marginTop: 12 }}>Guardar Hero</button>
      </div>

      {/* Contact */}
      <div style={{ background: '#111d35', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Información de Contacto</h3>
        <div className="adm-form-row">
          <div className="adm-field"><label>WhatsApp Principal</label><input value={contact.whatsappPrimary} onChange={e => setContact({ ...contact, whatsappPrimary: e.target.value })} /></div>
          <div className="adm-field"><label>WhatsApp Secundario</label><input value={contact.whatsappSecondary} onChange={e => setContact({ ...contact, whatsappSecondary: e.target.value })} /></div>
        </div>
        <div className="adm-form-row">
          <div className="adm-field"><label>Email</label><input value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} /></div>
          <div className="adm-field"><label>Instagram</label><input value={contact.instagram} onChange={e => setContact({ ...contact, instagram: e.target.value })} /></div>
        </div>
        <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Dirección</label><input value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })} /></div></div>
        <button className="adm-btn adm-btn--primary" onClick={saveContact} style={{ marginTop: 12 }}>Guardar Contacto</button>
      </div>
    </div>
  );
}
