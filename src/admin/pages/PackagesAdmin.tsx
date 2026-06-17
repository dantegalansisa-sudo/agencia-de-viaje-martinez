import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';
import type { Package } from '../../types';

const empty: Omit<Package, 'id'> = { resort: '', detail: '', price: '', zone: 'este', order: 0, active: true };

export default function PackagesAdmin() {
  const { data, loading, add, update, remove } = useCollection<Package>('packages', false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => { setForm({ ...empty, order: data.length }); setEditing(null); setShowModal(true); };
  const openEdit = (item: Package) => { setForm(item); setEditing(item); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const save = async () => {
    try {
      if (editing?.id) { const { id: _, ...rest } = form as Package; await update(editing.id, rest); toast.success('Paquete actualizado'); }
      else { await add(form); toast.success('Paquete creado'); }
      close();
    } catch { toast.error('Error'); }
  };

  if (loading) return <div className="adm-loading">Cargando...</div>;

  return (
    <div>
      <div className="adm-topbar">
        <div className="admin-page__header" style={{ marginBottom: 0 }}><h1 className="admin-page__title">Paquetes / Resorts</h1><p className="admin-page__sub">Ofertas todo incluido por zona</p></div>
        <button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nuevo Paquete</button>
      </div>
      {data.length === 0 ? <div className="adm-empty">No hay paquetes.</div> : (
        <table className="adm-table"><thead><tr><th>#</th><th>Resort</th><th>Detalle</th><th>Zona</th><th>Precio</th><th>Activo</th><th>Acciones</th></tr></thead>
          <tbody>{data.map(item => (
            <tr key={item.id}>
              <td>{item.order}</td><td style={{ fontWeight: 700, color: 'white' }}>{item.resort}</td><td>{item.detail}</td>
              <td><span className={`adm-tag ${item.zone === 'este' ? 'adm-tag--green' : 'adm-tag--gold'}`}>{item.zone === 'este' ? 'Zona Este' : 'Zona Norte'}</span></td>
              <td><span className="adm-tag adm-tag--gold">{item.price}</span></td>
              <td><button className={`adm-toggle${item.active ? ' adm-toggle--on' : ''}`} onClick={() => item.id && update(item.id, { active: !item.active })} /></td>
              <td><div className="adm-table__actions"><button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(item)}>Editar</button><button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDeleteId(item.id!)}>Eliminar</button></div></td>
            </tr>
          ))}</tbody></table>
      )}
      {showModal && (
        <div className="adm-overlay" onClick={close}><div className="adm-modal" onClick={e => e.stopPropagation()}>
          <h3 className="adm-modal__title">{editing ? 'Editar Paquete' : 'Nuevo Paquete'}</h3>
          <div className="adm-form-row"><div className="adm-field"><label>Resort</label><input value={form.resort} onChange={e => setForm({ ...form, resort: e.target.value })} placeholder="Whala Boca Chica" /></div><div className="adm-field"><label>Detalle</label><input value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} placeholder="3 Noches" /></div></div>
          <div className="adm-form-row"><div className="adm-field"><label>Precio</label><input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="US$353" /></div><div className="adm-field"><label>Zona</label><select value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value as 'este' | 'norte' })}><option value="este">Zona Este</option><option value="norte">Zona Norte</option></select></div></div>
          <div className="adm-form-row"><div className="adm-field"><label>Orden</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div><div className="adm-field"><label>Activo</label><select value={form.active ? 'true' : 'false'} onChange={e => setForm({ ...form, active: e.target.value === 'true' })}><option value="true">Sí</option><option value="false">No</option></select></div></div>
          <div className="adm-modal__actions"><button className="adm-btn adm-btn--ghost" onClick={close}>Cancelar</button><button className="adm-btn adm-btn--primary" onClick={save}>Guardar</button></div>
        </div></div>
      )}
      <ConfirmDialog open={!!deleteId} title="Eliminar paquete" message="¿Seguro?" onConfirm={async () => { if (deleteId) { await remove(deleteId); toast.success('Eliminado'); } setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
