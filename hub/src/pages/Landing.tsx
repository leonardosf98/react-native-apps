import { Link } from "react-router-dom";
import { apps } from "../data/apps";

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-hero">
        <h1>
          React Native <span>Apps</span>
        </h1>
        <p>
          Coleção de projetos em React Native com Expo. Explore cada app
          diretamente no navegador.
        </p>
      </header>

      <div className="app-grid">
        {apps.map((app) => (
          <Link
            key={app.slug}
            to={`/app/${app.slug}`}
            className="app-card"
          >
            <div
              className="app-card-banner"
              style={{ background: app.gradient }}
            >
              {app.emoji}
            </div>
            <div className="app-card-body">
              <span className="tag">{app.tag}</span>
              <h3>{app.title}</h3>
              <p>{app.description}</p>
            </div>
            <div className="app-card-footer">
              <span className="btn btn-primary">Abrir App →</span>
              {app.repo && (
                <span
                  className="btn btn-ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(app.repo, "_blank", "noopener,noreferrer");
                  }}
                >
                  Código
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <footer className="landing-footer">
        Feito com{" "}
        <a
          href="https://expo.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Expo
        </a>{" "}
        por{" "}
        <a
          href="https://leonardosouza.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Léo Souza
        </a>
      </footer>
    </div>
  );
}
