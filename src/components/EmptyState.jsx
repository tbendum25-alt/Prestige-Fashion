import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, text, actionLabel, to, onAction }) {
  return (
    <div className="empty">
      {Icon && <Icon size={42} strokeWidth={1.2} />}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {actionLabel && (to
        ? <Link className="btn btn--dark" to={to}>{actionLabel}</Link>
        : <button type="button" className="btn btn--dark" onClick={onAction}>{actionLabel}</button>)}
    </div>
  );
}
