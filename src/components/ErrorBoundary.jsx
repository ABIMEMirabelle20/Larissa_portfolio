import { Component } from 'react';
import { logError } from '../utils/logError';

// Si un composant plante, on affiche un message au lieu d'une page blanche.
// Texte bilingue en dur : la boundary doit marcher même si les traductions,
// elles aussi, sont à l'origine du plantage.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logError(error, `react:${this.props.name || 'root'}`);
    if (info?.componentStack) console.error(info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.silent) return null;

    return (
      <div role="alert" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          Une erreur est survenue / Something went wrong
        </h1>
        <p style={{ marginBottom: '1.5rem', color: 'var(--muted)' }}>
          Recharge la page ou écris-moi : mirabelleabime@gmail.com
        </p>
        <button className="btn btn--solid" onClick={() => window.location.reload()}>
          Recharger / Reload
        </button>
      </div>
    );
  }
}
