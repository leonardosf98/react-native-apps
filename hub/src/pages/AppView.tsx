import { useParams, Link } from "react-router-dom";
import { apps } from "../data/apps";

const APP_BASE = "/apps";

export default function AppView() {
  const { slug } = useParams<{ slug: string }>();
  const app = apps.find((a) => a.slug === slug);

  if (!app) {
    return (
      <div className="not-found">
        <h1>404</h1>
        <p>App não encontrado</p>
        <Link to="/" className="btn btn-primary">
          ← Voltar
        </Link>
      </div>
    );
  }

  const src = `${APP_BASE}/${app.slug}/`;

  return (
    <div className="app-view">
      <div className="app-view-bar">
        <Link to="/" className="back-btn">
          ← Hub
        </Link>
        <h2>{app.title}</h2>
        <span className="badge">{app.tag}</span>
      </div>
      <iframe
        className="app-view-frame"
        src={src}
        title={app.title}
        sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
      />
    </div>
  );
}
