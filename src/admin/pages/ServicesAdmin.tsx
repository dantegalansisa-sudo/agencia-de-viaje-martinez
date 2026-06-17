import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';
import type { ServiceItem } from '../../types';

const empty: Omit<ServiceItem, 'id'> = { icon: '', title: '', desc: '', order: 0, active: true };

export default function ServicesAdmin() {
  const { data, loading, add, update, remove } = useCollection<ServiceItem>('services', false);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => { setForm({ ...empty, order: data.length }); setEditing(null); setShowModal(true); };
  const openEdit = (item: ServiceItem) => { setForm(item); setEditing(item); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const save = async () => {
    try {
      if (editing?.id) { const { id: _, ...rest } = form as ServiceItem; await update(editing.id, rest); toast.success('Servicio actualizado'); }
      else { await add(form); toast.success('Servicio creado'); }
      close();
    } catch { toast.error('Error'); }
  };

  if (loading) return <div className="adm-loading">Cargando...</div>;
  return (
    <div>
      <div className="adm-topbar"><div className="admin-page__header" style={{ marginBottom: 0 }}><h1 className="admin-page__title">Servicios</h1><p className="admin-page__sub">Servicios que ofrece la agencia</p></div><button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nuevo Servicio</button></div>
      {data.length === 0 ? <div className="adm-empty">No hay servicios.</div> : (
        <table className="adm-table"><thead><tr><th>#</th><th>Icono</th><th>Título</th><th>Descripción</th><th>Activo</th><th>Acciones</th></tr></thead>
          <tbody>{data.map(item => (
            <tr key={item.id}><td>{item.order}</td><td style={{ fontSize: 24 }}>{item.icon}</td><td style={{ fontWeight: 700, color: 'white' }}>{item.title}</td><td style={{ maxWidth: 300, fontSize: 12 }}>{item.desc.slice(0, 60)}...</td>
              <td><button className={`adm-toggle${item.active ? ' adm-toggle--on' : ''}`} onClick={() => item.id && update(item.id, { active: !item.active })} /></td>
              <td><div className="adm-table__actions"><button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(item)}>Editar</button><button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDeleteId(item.id!)}>Eliminar</button></div></td>
            </tr>))}</tbody></table>
      )}
      {showModal && (
        <div className="adm-overlay" onClick={close}><div className="adm-modal" onClick={e => e.stopPropagation()}>
          <h3 className="adm-modal__title">{editing ? 'Editar' : 'Nuevo'} Servicio</h3>
          <div className="adm-form-row"><div className="adm-field"><label>Icono (emoji)</label><input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="✈️" /></div><div className="adm-field"><label>Título</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Boletos Aéreos" /></div></div>
          <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Descripción</label><textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Las mejores tarifas en vuelos..." /></div></div>
          <div className="adm-form-row"><div className="adm-field"><label>Orden</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div><div className="adm-field"><label>Activo</label><select value={form.active ? 'true' : 'false'} onChange={e => setForm({ ...form, active: e.target.value === 'true' })}><option value="true">Sí</option><option value="false">No</option></select></div></div>
          <div className="adm-modal__actions"><button className="adm-btn adm-btn--ghost" onClick={close}>Cancelar</button><button className="adm-btn adm-btn--primary" onClick={save}>Guardar</button></div>
        </div></div>
      )}
      <ConfirmDialog open={!!deleteId} title="Eliminar servicio" message="¿Seguro?" onConfirm={async () => { if (deleteId) { await remove(deleteId); toast.success('Eliminado'); } setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
