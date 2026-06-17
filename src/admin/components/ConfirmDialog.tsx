import './AdminComponents.css';

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="adm-overlay" onClick={onCancel}>
      <div className="adm-dialog" onClick={e => e.stopPropagation()}>
        <h3 className="adm-dialog__title">{title}</h3>
        <p className="adm-dialog__msg">{message}</p>
        <div className="adm-dialog__actions">
          <button className="adm-btn adm-btn--ghost" onClick={onCancel}>Cancelar</button>
          <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
