import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';
import type { GalleryImage } from '../../types';

const empty: Omit<GalleryImage, 'id'> = { imageUrl: '', alt: '', order: 0, active: true };

export default function GalleryAdmin() {
  const { data, loading, add, update, remove } = useCollection<GalleryImage>('gallery', false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => { setForm({ ...empty, order: data.length }); setEditing(null); setShowModal(true); };
  const openEdit = (item: GalleryImage) => { setForm(item); setEditing(item); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const save = async () => {
    try {
      if (editing?.id) { const { id: _, ...rest } = form as GalleryImage; await update(editing.id, rest); toast.success('Imagen actualizada'); }
      else { await add(form); toast.success('Imagen creada'); }
      close();
    } catch { toast.error('Error'); }
  };

  if (loading) return <div className="adm-loading">Cargando...</div>;
  return (
    <div>
      <div className="adm-topbar"><div className="admin-page__header" style={{ marginBottom: 0 }}><h1 className="admin-page__title">Galería</h1><p className="admin-page__sub">Fotos de viajes</p></div><button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nueva Imagen</button></div>
      {data.length === 0 ? <div className="adm-empty">No hay imágenes.</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {data.map(item => (
            <div key={item.id} style={{ background: '#111d35', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.alt} style={{ width: '100%', height: 140, objectFit: 'cover' }} />}
              <div style={{ padding: '10px 12px', display: 'flex', gap: 6 }}>
                <button className="adm-btn adm-btn--ghost adm-btn--sm" style={{ flex: 1 }} onClick={() => openEdit(item)}>Editar</button>
                <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDeleteId(item.id!)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="adm-overlay" onClick={close}><div className="adm-modal" onClick={e => e.stopPropagation()}>
          <h3 className="adm-modal__title">{editing ? 'Editar' : 'Nueva'} Imagen</h3>
          <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Imagen</label><ImageUploader folder="gallery" currentUrl={form.imageUrl} onUploaded={url => setForm({ ...form, imageUrl: url })} /></div></div>
          <div className="adm-form-row"><div className="adm-field"><label>Descripción</label><input value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} placeholder="Viaje a Punta Cana" /></div><div className="adm-field"><label>Orden</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div></div>
          <div className="adm-modal__actions"><button className="adm-btn adm-btn--ghost" onClick={close}>Cancelar</button><button className="adm-btn adm-btn--primary" onClick={save}>Guardar</button></div>
        </div></div>
      )}
      <ConfirmDialog open={!!deleteId} title="Eliminar imagen" message="¿Seguro?" onConfirm={async () => { if (deleteId) { await remove(deleteId); toast.success('Eliminada'); } setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
