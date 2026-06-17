import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';

interface Promo {
  id?: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  type: 'daypass' | 'tour';
  order: number;
  active: boolean;
}

const empty: Omit<Promo, 'id'> = { title: '', description: '', price: '', imageUrl: '', type: 'daypass', order: 0, active: true };

export default function PromosAdmin() {
  const { data, loading, add, update, remove } = useCollection<Promo>('promos', false);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'daypass' | 'tour'>('all');

  const filtered = filterType === 'all' ? data : data.filter(p => p.type === filterType);

  const openNew = (type: 'daypass' | 'tour') => { setForm({ ...empty, type, order: data.length }); setEditing(null); setShowModal(true); };
  const openEdit = (item: Promo) => { setForm(item); setEditing(item); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const save = async () => {
    if (!form.imageUrl) { toast.error('Sube una imagen primero'); return; }
    try {
      if (editing?.id) { const { id: _, ...rest } = form as Promo; await update(editing.id, rest); toast.success('Promo actualizada'); }
      else { await add(form); toast.success('Promo creada'); }
      close();
    } catch { toast.error('Error'); }
  };

  if (loading) return <div className="adm-loading">Cargando...</div>;

  return (
    <div>
      <div className="adm-topbar">
        <div className="admin-page__header" style={{ marginBottom: 0 }}>
          <h1 className="admin-page__title">Day Pass & Tours</h1>
          <p className="admin-page__sub">Flyers promocionales — se muestran en la pestaña Nacional</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="adm-btn adm-btn--primary" onClick={() => openNew('daypass')}>+ Day Pass</button>
          <button className="adm-btn adm-btn--primary" onClick={() => openNew('tour')}>+ Tour</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['all', 'daypass', 'tour'] as const).map(t => (
          <button key={t} className={`adm-btn ${filterType === t ? 'adm-btn--primary' : 'adm-btn--ghost'} adm-btn--sm`} onClick={() => setFilterType(t)}>
            {t === 'all' ? 'Todas' : t === 'daypass' ? 'Day Pass' : 'Tour'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? <div className="adm-empty">No hay promos. Crea la primera subiendo un flyer.</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: '#111d35', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />}
              <div style={{ padding: 14 }}>
                <span className={`adm-tag ${item.type === 'daypass' ? 'adm-tag--gold' : 'adm-tag--green'}`} style={{ marginBottom: 8, display: 'inline-block' }}>
                  {item.type === 'daypass' ? 'Day Pass' : 'Tour'}
                </span>
                <div style={{ fontWeight: 700, color: 'white', fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                {item.price && <div style={{ color: '#FF8F00', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{item.price}</div>}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button className={`adm-toggle${item.active ? ' adm-toggle--on' : ''}`} onClick={() => item.id && update(item.id, { active: !item.active })} />
                  <button className="adm-btn adm-btn--ghost adm-btn--sm" style={{ flex: 1 }} onClick={() => openEdit(item)}>Editar</button>
                  <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDeleteId(item.id!)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="adm-overlay" onClick={close}><div className="adm-modal" onClick={e => e.stopPropagation()}>
          <h3 className="adm-modal__title">{editing ? 'Editar' : 'Nueva'} Promo — {form.type === 'daypass' ? 'Day Pass' : 'Tour'}</h3>
          <div className="adm-form-row adm-form-row--full">
            <div className="adm-field"><label>Flyer / Imagen</label><ImageUploader folder="promos" currentUrl={form.imageUrl} onUploaded={url => setForm({ ...form, imageUrl: url })} /></div>
          </div>
          <div className="adm-form-row">
            <div className="adm-field"><label>Título</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Day Pass Playa Dorada" /></div>
            <div className="adm-field"><label>Precio (opcional)</label><input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="RD$2,500 por persona" /></div>
          </div>
          <div className="adm-form-row adm-form-row--full">
            <div className="adm-field"><label>Descripción (opcional)</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Incluye almuerzo, bebidas y acceso a piscina..." /></div>
          </div>
          <div className="adm-form-row">
            <div className="adm-field"><label>Tipo</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'daypass' | 'tour' })}><option value="daypass">Day Pass</option><option value="resort">Tour</option></select></div>
            <div className="adm-field"><label>Orden</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div>
          </div>
          <div className="adm-modal__actions"><button className="adm-btn adm-btn--ghost" onClick={close}>Cancelar</button><button className="adm-btn adm-btn--primary" onClick={save}>Guardar</button></div>
        </div></div>
      )}

      <ConfirmDialog open={!!deleteId} title="Eliminar promo" message="¿Seguro?" onConfirm={async () => { if (deleteId) { await remove(deleteId); toast.success('Eliminada'); } setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
