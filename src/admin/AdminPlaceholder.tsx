export default function AdminPlaceholder({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="admin-placeholder">
      <div className="admin-placeholder__icon">{icon}</div>
      <div className="admin-placeholder__text">{title}</div>
      <div className="admin-placeholder__sub">Próximamente — en construcción</div>
    </div>
  );
}
