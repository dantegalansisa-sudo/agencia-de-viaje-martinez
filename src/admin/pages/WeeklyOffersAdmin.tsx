import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';
import type { WeeklyOffer } from '../../types';

const empty: Omit<WeeklyOffer, 'id'> = {
  route: '', code: '', price: '', tag: null, order: 0, active: true,
};

export default function WeeklyOffersAdmin() {
  const { data, loading, add, update, remove } = useCollection<WeeklyOffer>('weeklyOffers', false);
  const [editing, setEditing] = useState<WeeklyOffer | null>(null);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => { setForm({ ...empty, order: data.length }); setEditing(null); setShowModal(true); };
  const openEdit = (item: WeeklyOffer) => { setForm(item); setEditing(item); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const save = async () => {
    try {
      if (editing?.id) {
        const { id, ...rest } = form as WeeklyOffer;
        void id;
        await update(editing.id, rest);
        toast.success('Oferta actualizada');
      } else {
        await add(form);
        toast.success('Oferta creada');
      }
      close();
    } catch { toast.error('Error al guardar'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      toast.success('Oferta eliminada');
    } catch { toast.error('Error al eliminar'); }
    setDeleteId(null);
  };

  if (loading) return <div className="adm-loading">Cargando ofertas...</div>;

  return (
    <div>
      <div className="adm-topbar">
        <div className="admin-page__header" style={{ marginBottom: 0 }}>
          <h1 className="admin-page__title">Ofertas Semanales</h1>
          <p className="admin-page__sub">Destinos destacados en la barra de ofertas</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nueva Oferta</button>
      </div>

      {data.length === 0 ? (
        <div className="adm-empty">No hay ofertas. Crea la primera.</div>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Destino</th>
              <th>Código</th>
              <th>Precio</th>
              <th>Tag</th>
              <th>Activa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.order}</td>
                <td style={{ fontWeight: 700, color: 'white' }}>{item.route}</td>
                <td>{item.code}</td>
                <td><span className="adm-tag adm-tag--gold">{item.price}</span></td>
                <td>{item.tag ? <span className="adm-tag adm-tag--green">{item.tag}</span> : '—'}</td>
                <td>
                  <button
                    className={`adm-toggle${item.active ? ' adm-toggle--on' : ''}`}
                    onClick={() => item.id && update(item.id, { active: !item.active })}
                  />
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

      {/* Modal */}
      {showModal && (
        <div className="adm-overlay" onClick={close}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <h3 className="adm-modal__title">{editing ? 'Editar Oferta' : 'Nueva Oferta'}</h3>
            <div className="adm-form-row">
              <div className="adm-field">
                <label>Destino</label>
                <input value={form.route} onChange={e => setForm({ ...form, route: e.target.value })} placeholder="Nueva York" />
              </div>
              <div className="adm-field">
                <label>Código aeropuerto</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="JFK" />
              </div>
            </div>
            <div className="adm-form-row">
              <div className="adm-field">
                <label>Precio</label>
                <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="RD$28,000" />
              </div>
              <div className="adm-field">
                <label>Tag (opcional)</label>
                <input value={form.tag || ''} onChange={e => setForm({ ...form, tag: e.target.value || null })} placeholder="Más Popular" />
              </div>
            </div>
            <div className="adm-form-row">
              <div className="adm-field">
                <label>Orden</label>
                <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <div className="adm-field">
                <label>Activa</label>
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

      <ConfirmDialog
        open={!!deleteId}
        title="Eliminar oferta"
        message="¿Seguro que deseas eliminar esta oferta? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
