import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';
import type { Flight } from '../../types';

const empty: Omit<Flight, 'id'> = {
  city: '', to: '', price: '', country: '', order: 0, active: true,
};

export default function FlightsAdmin() {
  const { data, loading, add, update, remove } = useCollection<Flight>('flights', false);
  const [editing, setEditing] = useState<Flight | null>(null);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => { setForm({ ...empty, order: data.length }); setEditing(null); setShowModal(true); };
  const openEdit = (item: Flight) => { setForm(item); setEditing(item); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const save = async () => {
    try {
      if (editing?.id) {
        const { id, ...rest } = form as Flight;
        void id;
        await update(editing.id, rest);
        toast.success('Vuelo actualizado');
      } else {
        await add(form);
        toast.success('Vuelo creado');
      }
      close();
    } catch { toast.error('Error al guardar'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await remove(deleteId); toast.success('Vuelo eliminado'); } catch { toast.error('Error'); }
    setDeleteId(null);
  };

  if (loading) return <div className="adm-loading">Cargando vuelos...</div>;

  return (
    <div>
      <div className="adm-topbar">
        <div className="admin-page__header" style={{ marginBottom: 0 }}>
          <h1 className="admin-page__title">Vuelos</h1>
          <p className="admin-page__sub">Precios de vuelos desde Santo Domingo</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nuevo Vuelo</button>
      </div>

      {data.length === 0 ? (
        <div className="adm-empty">No hay vuelos. Crea el primero.</div>
      ) : (
        <table className="adm-table">
          <thead>
            <tr><th>#</th><th>Ciudad</th><th>Código</th><th>País</th><th>Precio</th><th>Activo</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.order}</td>
                <td style={{ fontWeight: 700, color: 'white' }}>{item.city}</td>
                <td>{item.to}</td>
                <td>{item.country}</td>
                <td><span className="adm-tag adm-tag--gold">{item.price}</span></td>
                <td>
                  <button className={`adm-toggle${item.active ? ' adm-toggle--on' : ''}`} onClick={() => item.id && update(item.id, { active: !item.active })} />
                </td>
                <td>
                  <div className="adm-table__actions">
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(item)}>Editar</button>
                    <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDeleteId(item.id!)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="adm-overlay" onClick={close}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <h3 className="adm-modal__title">{editing ? 'Editar Vuelo' : 'Nuevo Vuelo'}</h3>
            <div className="adm-form-row">
              <div className="adm-field">
                <label>Ciudad</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Nueva York" />
              </div>
              <div className="adm-field">
                <label>Código destino</label>
                <input value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} placeholder="JFK" />
              </div>
            </div>
            <div className="adm-form-row">
              <div className="adm-field">
                <label>País (ISO 2 letras)</label>
                <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="US" />
              </div>
              <div className="adm-field">
                <label>Precio</label>
                <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="RD$28,000" />
              </div>
            </div>
            <div className="adm-form-row">
              <div className="adm-field">
                <label>Orden</label>
                <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <div className="adm-field">
                <label>Activo</label>
                <select value={form.active ? 'true' : 'false'} onChange={e => setForm({ ...form, active: e.target.value === 'true' })}>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className="adm-modal__actions">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancelar</button>
              <button className="adm-btn adm-btn--primary" onClick={save}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Eliminar vuelo" message="¿Seguro?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
