import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';
import type { Destination } from '../../types';

const empty: Omit<Destination, 'id'> = { city: '', country: '', code: '', price: '', imageUrl: '', tag: null, category: 'international', order: 0, active: true };

export default function DestinationsAdmin() {
  const { data, loading, add, update, remove } = useCollection<Destination>('destinations', false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => { setForm({ ...empty, order: data.length }); setEditing(null); setShowModal(true); };
  const openEdit = (item: Destination) => { setForm(item); setEditing(item); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const save = async () => {
    try {
      if (editing?.id) { const { id: _, ...rest } = form as Destination; await update(editing.id, rest); toast.success('Destino actualizado'); }
      else { await add(form); toast.success('Destino creado'); }
      close();
    } catch { toast.error('Error'); }
  };

  if (loading) return <div className="adm-loading">Cargando...</div>;
  return (
    <div>
      <div className="adm-topbar"><div className="admin-page__header" style={{ marginBottom: 0 }}><h1 className="admin-page__title">Destinos</h1><p className="admin-page__sub">Tarjetas de destinos con fotos</p></div><button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nuevo Destino</button></div>
      {data.length === 0 ? <div className="adm-empty">No hay destinos.</div> : (
        <table className="adm-table"><thead><tr><th>Foto</th><th>Ciudad</th><th>País</th><th>Código</th><th>Cat.</th><th>Precio</th><th>Activo</th><th>Acciones</th></tr></thead>
          <tbody>{data.map(item => (
            <tr key={item.id}>
              <td>{item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: 48, height: 36, borderRadius: 6, objectFit: 'cover' }} /> : '—'}</td>
              <td style={{ fontWeight: 700, color: 'white' }}>{item.city}</td><td>{item.country}</td><td>{item.code}</td>
              <td><span className={`adm-tag ${item.category === 'international' ? 'adm-tag--green' : 'adm-tag--gold'}`}>{item.category === 'international' ? 'Intl' : 'Nacional'}</span></td>
              <td><span className="adm-tag adm-tag--gold">{item.price}</span></td>
              <td><button className={`adm-toggle${item.active ? ' adm-toggle--on' : ''}`} onClick={() => item.id && update(item.id, { active: !item.active })} /></td>
              <td><div className="adm-table__actions"><button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(item)}>Editar</button><button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDeleteId(item.id!)}>Eliminar</button></div></td>
            </tr>))}</tbody></table>
      )}
      {showModal && (
        <div className="adm-overlay" onClick={close}><div className="adm-modal" onClick={e => e.stopPropagation()}>
          <h3 className="adm-modal__title">{editing ? 'Editar' : 'Nuevo'} Destino</h3>
          <div className="adm-form-row"><div className="adm-field"><label>Ciudad</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Nueva York" /></div><div className="adm-field"><label>País</label><input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="Estados Unidos" /></div></div>
          <div className="adm-form-row"><div className="adm-field"><label>Código</label><input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="JFK" /></div><div className="adm-field"><label>Precio</label><input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Desde RD$28,000" /></div></div>
          <div className="adm-form-row"><div className="adm-field"><label>Categoría</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as 'international' | 'national' })}><option value="international">Internacional</option><option value="national">Nacional</option></select></div><div className="adm-field"><label>Tag (opcional)</label><input value={form.tag || ''} onChange={e => setForm({ ...form, tag: e.target.value || null })} placeholder="Más Visitado" /></div></div>
          <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Imagen</label><ImageUploader folder="destinations" currentUrl={form.imageUrl} onUploaded={url => setForm({ ...form, imageUrl: url })} /></div></div>
          <div className="adm-form-row"><div className="adm-field"><label>Orden</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div><div className="adm-field"><label>Activo</label><select value={form.active ? 'true' : 'false'} onChange={e => setForm({ ...form, active: e.target.value === 'true' })}><option value="true">Sí</option><option value="false">No</option></select></div></div>
          <div className="adm-modal__actions"><button className="adm-btn adm-btn--ghost" onClick={close}>Cancelar</button><button className="adm-btn adm-btn--primary" onClick={save}>Guardar</button></div>
        </div></div>
      )}
      <ConfirmDialog open={!!deleteId} title="Eliminar destino" message="¿Seguro?" onConfirm={async () => { if (deleteId) { await remove(deleteId); toast.success('Eliminado'); } setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
