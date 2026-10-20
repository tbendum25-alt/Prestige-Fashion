import { Link } from 'react-router-dom';

export default function SectionHeading({ title, text, linkLabel, to, light = false }) {
  return (
    <div className={`section-heading ${light ? 'section-heading--light' : ''}`}>
      <div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {to && <Link to={to} className="link-underline">{linkLabel || 'Tout voir'}</Link>}
    </div>
  );
}
