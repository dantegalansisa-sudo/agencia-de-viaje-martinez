import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';
import type { Hotel } from '../../types';

const empty: Omit<Hotel, 'id'> = { name: '', city: '', price: '', stars: 4, country: 'DO', order: 0, active: true };

export default function HotelsIntlAdmin() {
  const { data, loading, add, update, remove } = useCollection<Hotel>('hotelsInternational', false);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => { setForm({ ...empty, order: data.length }); setEditing(null); setShowModal(true); };
  const openEdit = (item: Hotel) => { setForm(item); setEditing(item); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const save = async () => {
    try {
      if (editing?.id) { const { id: _, ...rest } = form as Hotel; await update(editing.id, rest); toast.success('Hotel actualizado'); }
      else { await add(form); toast.success('Hotel creado'); }
      close();
    } catch { toast.error('Error al guardar'); }
  };

  if (loading) return <div className="adm-loading">Cargando...</div>;

  return (
    <div>
      <div className="adm-topbar">
        <div className="admin-page__header" style={{ marginBottom: 0 }}>
          <h1 className="admin-page__title">Hoteles Internacional</h1>
          <p className="admin-page__sub">Hoteles fuera de República Dominicana</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nuevo Hotel</button>
      </div>

      {data.length === 0 ? <div className="adm-empty">No hay hoteles.</div> : (
        <table className="adm-table">
          <thead><tr><th>#</th><th>Hotel</th><th>Ciudad</th><th>Estrellas</th><th>Precio</th><th>Activo</th><th>Acciones</th></tr></thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.order}</td>
                <td style={{ fontWeight: 700, color: 'white' }}>{item.name}</td>
                <td>{item.city}</td>
                <td>{'⭐'.repeat(item.stars)}</td>
                <td><span className="adm-tag adm-tag--gold">{item.price}</span></td>
                <td><button className={`adm-toggle${item.active ? ' adm-toggle--on' : ''}`} onClick={() => item.id && update(item.id, { active: !item.active })} /></td>
                <td><div className="adm-table__actions">
                  <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(item)}>Editar</button>
                  <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDeleteId(item.id!)}>Eliminar</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="adm-overlay" onClick={close}><div className="adm-modal" onClick={e => e.stopPropagation()}>
          <h3 className="adm-modal__title">{editing ? 'Editar Hotel' : 'Nuevo Hotel'}</h3>
          <div className="adm-form-row">
            <div className="adm-field"><label>Nombre</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nickelodeon Resort" /></div>
            <div className="adm-field"><label>Ciudad</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Punta Cana" /></div>
          </div>
          <div className="adm-form-row">
            <div className="adm-field"><label>Precio</label><input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="RD$52,164" /></div>
            <div className="adm-field"><label>Estrellas</label><input type="number" min={1} max={5} value={form.stars} onChange={e => setForm({ ...form, stars: Number(e.target.value) })} /></div>
          </div>
          <div className="adm-form-row">
            <div className="adm-field"><label>Orden</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div>
            <div className="adm-field"><label>Activo</label><select value={form.active ? 'true' : 'false'} onChange={e => setForm({ ...form, active: e.target.value === 'true' })}><option value="true">Sí</option><option value="false">No</option></select></div>
          </div>
          <div className="adm-modal__actions">
            <button className="adm-btn adm-btn--ghost" onClick={close}>Cancelar</button>
            <button className="adm-btn adm-btn--primary" onClick={save}>Guardar</button>
          </div>
        </div></div>
      )}
      <ConfirmDialog open={!!deleteId} title="Eliminar hotel" message="¿Seguro?" onConfirm={async () => { if (deleteId) { await remove(deleteId); toast.success('Eliminado'); } setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
