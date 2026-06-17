import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import '../components/AdminComponents.css';
import type { FAQ } from '../../types';

const empty: Omit<FAQ, 'id'> = { question: '', answer: '', order: 0, active: true };

export default function FaqsAdmin() {
  const { data, loading, add, update, remove } = useCollection<FAQ>('faqs', false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState(empty);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => { setForm({ ...empty, order: data.length }); setEditing(null); setShowModal(true); };
  const openEdit = (item: FAQ) => { setForm(item); setEditing(item); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const save = async () => {
    try {
      if (editing?.id) { const { id: _, ...rest } = form as FAQ; await update(editing.id, rest); toast.success('FAQ actualizada'); }
      else { await add(form); toast.success('FAQ creada'); }
      close();
    } catch { toast.error('Error'); }
  };

  if (loading) return <div className="adm-loading">Cargando...</div>;
  return (
    <div>
      <div className="adm-topbar"><div className="admin-page__header" style={{ marginBottom: 0 }}><h1 className="admin-page__title">Preguntas Frecuentes</h1><p className="admin-page__sub">FAQ del sitio web</p></div><button className="adm-btn adm-btn--primary" onClick={openNew}>+ Nueva FAQ</button></div>
      {data.length === 0 ? <div className="adm-empty">No hay FAQs.</div> : (
        <table className="adm-table"><thead><tr><th>#</th><th>Pregunta</th><th>Activa</th><th>Acciones</th></tr></thead>
          <tbody>{data.map(item => (
            <tr key={item.id}><td>{item.order}</td><td style={{ fontWeight: 700, color: 'white', maxWidth: 400 }}>{item.question}</td>
              <td><button className={`adm-toggle${item.active ? ' adm-toggle--on' : ''}`} onClick={() => item.id && update(item.id, { active: !item.active })} /></td>
              <td><div className="adm-table__actions"><button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(item)}>Editar</button><button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setDeleteId(item.id!)}>Eliminar</button></div></td>
            </tr>))}</tbody></table>
      )}
      {showModal && (
        <div className="adm-overlay" onClick={close}><div className="adm-modal" onClick={e => e.stopPropagation()}>
          <h3 className="adm-modal__title">{editing ? 'Editar' : 'Nueva'} FAQ</h3>
          <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Pregunta</label><input value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="¿Cómo puedo reservar?" /></div></div>
          <div className="adm-form-row adm-form-row--full"><div className="adm-field"><label>Respuesta</label><textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} placeholder="Usa nuestro buscador..." /></div></div>
          <div className="adm-form-row"><div className="adm-field"><label>Orden</label><input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} /></div><div className="adm-field"><label>Activa</label><select value={form.active ? 'true' : 'false'} onChange={e => setForm({ ...form, active: e.target.value === 'true' })}><option value="true">Sí</option><option value="false">No</option></select></div></div>
          <div className="adm-modal__actions"><button className="adm-btn adm-btn--ghost" onClick={close}>Cancelar</button><button className="adm-btn adm-btn--primary" onClick={save}>Guardar</button></div>
        </div></div>
      )}
      <ConfirmDialog open={!!deleteId} title="Eliminar FAQ" message="¿Seguro?" onConfirm={async () => { if (deleteId) { await remove(deleteId); toast.success('Eliminada'); } setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
