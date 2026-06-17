import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';
import type { Testimonial } from '../../types';

const empty: Omit<Testimonial, 'id'> = { name: '', initials: '', location: '', destination: '', text: '', rating: 5, order: 0, active: true };

export default function TestimonialsAdmin() {
  const { data, loading, add, update, remove } = useCollection<Testimonial>('testimonials', false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => { setForm({ ...empty, order: data.length }); setEditing(null); setShowModal(true); };
  const openEdit = (item: Testimonial) => { setForm(item); setEditing(item); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const save = async () => {
    try {
      const autoInitials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      const toSave = { ...form, initials: form.initials || autoInitials };
      if (editing?.id) { const { id: _, ...rest } = toSave as Testimonial; await update(editing.id, rest); toast.success('Testimonio actualizado'); }
      else { await add(toSave); toast.success('Testimonio creado'); }
      close();
    } catch { toast.error('Error'); }
  };

  if (loading) return <div className="adm-loading">Cargando...</div>;
  return (
    <div>
      <div className="adm-topbar"><div className="admin-page__header" style={{ marginBottom: 0 }}><h1 className="admin-page__title">Testimonios</h1><p className="admin-page__sub">Reseñas de clientes</p></div><button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nuevo Testimonio</button></div>
      {data.length === 0 ? <div className="adm-empty">No hay testimonios.</div> : (
        <table className="adm-table"><thead><tr><th>#</th><th>Nombre</th><th>Ubicación</th><th>Destino</th><th>Rating</th><th>Activo</th><th>Acciones</th></tr></thead>
          <tbody>{data.map(item => (
            <tr key={item.id}><td>{item.order}</td><td style={{ fontWeight: 700, color: 'white' }}>{item.name}</td><td>{item.location}</td><td><span className="adm-tag adm-tag--green">{item.destination}</span></td><td>{'⭐'.repeat(item.rating)}</td>
              <td><button className={`adm-toggle${item.active ? ' adm-toggle--on' : ''}`} onClick={() => item.id && update(item.id, { active: !item.active })} /></td>
              <td><div className="adm-table__actions"><button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(item)}>Editar</button><button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDeleteId(item.id!)}>Eliminar</button></div></td>
            </tr>))}</tbody></table>
      )}
      {showModal && (
        <div className="adm-overlay" onClick={close}><div className="adm-modal" onClick={e => e.stopPropagation()}>
          <h3 className="adm-modal__title">{editing ? 'Editar' : 'Nuevo'} Testimonio</h3>
          <div className="adm-form-row"><div className="adm-field"><label>Nombre</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Carmen Rodríguez" /></div><div className="adm-field"><label>Ubicación</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="San Pedro de Macorís" /></div></div>
          <div className="adm-form-row"><div className="adm-field"><label>Destino</label><input value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} placeholder="Voló a Miami" /></div><div className="adm-field"><label>Rating (1-5)</label><input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} /></div></div>
          <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Texto</label><textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} placeholder="Martínez me consiguió el vuelo más barato..." /></div></div>
          <div className="adm-form-row"><div className="adm-field"><label>Orden</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div><div className="adm-field"><label>Activo</label><select value={form.active ? 'true' : 'false'} onChange={e => setForm({ ...form, active: e.target.value === 'true' })}><option value="true">Sí</option><option value="false">No</option></select></div></div>
          <div className="adm-modal__actions"><button className="adm-btn adm-btn--ghost" onClick={close}>Cancelar</button><button className="adm-btn adm-btn--primary" onClick={save}>Guardar</button></div>
        </div></div>
      )}
      <ConfirmDialog open={!!deleteId} title="Eliminar testimonio" message="¿Seguro?" onConfirm={async () => { if (deleteId) { await remove(deleteId); toast.success('Eliminado'); } setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
