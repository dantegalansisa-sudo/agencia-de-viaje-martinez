import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';
import type { TeamMember } from '../../types';

const empty: Omit<TeamMember, 'id'> = { name: '', role: '', bio: '', imageUrl: '', instagram: '', isLeadership: false, leadershipGroupImage: null, order: 0, active: true };

export default function TeamAdmin() {
  const { data, loading, add, update, remove } = useCollection<TeamMember>('team', false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => { setForm({ ...empty, order: data.length }); setEditing(null); setShowModal(true); };
  const openEdit = (item: TeamMember) => { setForm(item); setEditing(item); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const save = async () => {
    try {
      if (editing?.id) { const { id: _, ...rest } = form as TeamMember; await update(editing.id, rest); toast.success('Miembro actualizado'); }
      else { await add(form); toast.success('Miembro creado'); }
      close();
    } catch { toast.error('Error'); }
  };

  if (loading) return <div className="adm-loading">Cargando...</div>;
  return (
    <div>
      <div className="adm-topbar"><div className="admin-page__header" style={{ marginBottom: 0 }}><h1 className="admin-page__title">Equipo</h1><p className="admin-page__sub">Miembros del equipo</p></div><button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nuevo Miembro</button></div>
      {data.length === 0 ? <div className="adm-empty">No hay miembros.</div> : (
        <table className="adm-table"><thead><tr><th>Foto</th><th>Nombre</th><th>Rol</th><th>Líder</th><th>Activo</th><th>Acciones</th></tr></thead>
          <tbody>{data.map(item => (
            <tr key={item.id}>
              <td>{item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} /> : '—'}</td>
              <td style={{ fontWeight: 700, color: 'white' }}>{item.name}</td><td>{item.role}</td>
              <td>{item.isLeadership ? <span className="adm-tag adm-tag--green">Sí</span> : '—'}</td>
              <td><button className={`adm-toggle${item.active ? ' adm-toggle--on' : ''}`} onClick={() => item.id && update(item.id, { active: !item.active })} /></td>
              <td><div className="adm-table__actions"><button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(item)}>Editar</button><button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDeleteId(item.id!)}>Eliminar</button></div></td>
            </tr>))}</tbody></table>
      )}
      {showModal && (
        <div className="adm-overlay" onClick={close}><div className="adm-modal" onClick={e => e.stopPropagation()}>
          <h3 className="adm-modal__title">{editing ? 'Editar' : 'Nuevo'} Miembro</h3>
          <div className="adm-form-row"><div className="adm-field"><label>Nombre</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jesús de la Cruz" /></div><div className="adm-field"><label>Rol</label><input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Presidente" /></div></div>
          <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Empresario y líder..." /></div></div>
          <div className="adm-form-row"><div className="adm-field"><label>Instagram</label><input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="@agenciadeviajesmartinez" /></div><div className="adm-field"><label>Es liderazgo</label><select value={form.isLeadership ? 'true' : 'false'} onChange={e => setForm({ ...form, isLeadership: e.target.value === 'true' })}><option value="false">No</option><option value="true">Sí</option></select></div></div>
          <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Foto individual</label><ImageUploader folder="team" currentUrl={form.imageUrl} onUploaded={url => setForm({ ...form, imageUrl: url })} /></div></div>
          {form.isLeadership && (
            <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Foto grupal de liderazgo</label><ImageUploader folder="team" currentUrl={form.leadershipGroupImage || ''} onUploaded={url => setForm({ ...form, leadershipGroupImage: url })} /></div></div>
          )}
          <div className="adm-form-row"><div className="adm-field"><label>Orden</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div><div className="adm-field"><label>Activo</label><select value={form.active ? 'true' : 'false'} onChange={e => setForm({ ...form, active: e.target.value === 'true' })}><option value="true">Sí</option><option value="false">No</option></select></div></div>
          <div className="adm-modal__actions"><button className="adm-btn adm-btn--ghost" onClick={close}>Cancelar</button><button className="adm-btn adm-btn--primary" onClick={save}>Guardar</button></div>
        </div></div>
      )}
      <ConfirmDialog open={!!deleteId} title="Eliminar miembro" message="¿Seguro?" onConfirm={async () => { if (deleteId) { await remove(deleteId); toast.success('Eliminado'); } setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
