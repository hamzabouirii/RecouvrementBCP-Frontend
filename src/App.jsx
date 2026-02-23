import { useState } from 'react';
import './index.css';
import Layout from './components/layout/Layout';
import DossiersContentieux from './pages/contentieux/DossiersContentieux';

function App() {
  const [activePage, setActivePage] = useState('dossiers-contentieux');

  const getPageTitle = () => {
    switch (activePage) {
      case 'dossiers-contentieux':
        return { title: 'Dossiers', highlight: 'Contentieux' };
      case 'dossiers-amiable':
        return { title: 'Dossiers', highlight: 'Amiable' };
      case 'avocats':
        return { title: 'Gestion des', highlight: 'Avocats' };
      case 'cabinets':
        return { title: 'Gestion des', highlight: 'Cabinets' };
      case 'factures-contentieux':
        return { title: 'Factures', highlight: 'Contentieux' };
      case 'factures-amiable':
        return { title: 'Factures', highlight: 'Amiable' };
      default:
        return { title: 'Dashboard', highlight: '' };
    }
  };

  const { title, highlight } = getPageTitle();

  const renderPage = () => {
    switch (activePage) {
      case 'dossiers-contentieux':
        return <DossiersContentieux />;
      default:
        return (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--gray-400)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Page en construction</h2>
            <p style={{ fontSize: 14 }}>Cette section sera développée prochainement.</p>
          </div>
        );
    }
  };

  return (
    <Layout
      activeItem={activePage}
      onNavigate={setActivePage}
      pageTitle={title}
      pageHighlight={highlight}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
