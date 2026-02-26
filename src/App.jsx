import { useState } from 'react';
import './index.css';
import Layout from './components/layout/Layout';
import DossiersContentieux from './pages/contentieux/DossiersContentieux';
import FacturesContentieux from './pages/contentieux/FacturesContentieux';
import GestionAvocats from './pages/avocats/GestionAvocats';

/* ===== MOCK FACTURES — pre-populated for demo ===== */
const INITIAL_FACTURES = [
  {
    id: 1001,
    numero: 'FAC-2026-1001',
    date_facture: '2026-01-15',
    montant_total: 62750,
    statut: 'EMISE',
    dossier_reference: 'CTX-2026-00142',
    dossier_id: 1,
    client: 'Société Atlas Travaux SARL',
    avocat: 'Me. Karim Bennani',
    etapeCode: 'ASS',
    etapeLibelle: 'Assignation au Paiement',
    honorairesLignes: [
      { code: 'INJ', libelle: 'Injonction de Payer', honoraire: 24250, isCurrent: false },
      { code: 'ASS', libelle: 'Assignation au Paiement', honoraire: 24250, isCurrent: true },
    ],
    honorairesTotal: 48500,
    fraisList: [
      { id: 101, libelle: 'Frais de greffe', montant: 8500 },
      { id: 102, libelle: 'Frais d\'huissier', montant: 5750 },
    ],
    fraisTotal: 14250,
    motif_rejet: null,
  },
  {
    id: 1002,
    numero: 'FAC-2026-1002',
    date_facture: '2026-01-22',
    montant_total: 98000,
    statut: 'VALIDEE',
    dossier_reference: 'CTX-2026-00215',
    dossier_id: 3,
    client: 'Groupe Immobilier Zenith SA',
    avocat: 'Me. Youssef Amrani',
    etapeCode: 'RHY',
    etapeLibelle: 'Réalisation Hypothécaire',
    honorairesLignes: [
      { code: 'INJ', libelle: 'Injonction de Payer', honoraire: 14000, isCurrent: false },
      { code: 'ASS', libelle: 'Assignation au Paiement', honoraire: 14000, isCurrent: false },
      { code: 'MCV', libelle: 'Mesures Conservatoires', honoraire: 14000, isCurrent: false },
      { code: 'RHY', libelle: 'Réalisation Hypothécaire', honoraire: 14000, isCurrent: true },
    ],
    honorairesTotal: 56000,
    fraisList: [
      { id: 201, libelle: 'Frais notaire hypothécaire', montant: 25000 },
      { id: 202, libelle: 'Expertise immobilière', montant: 12000 },
      { id: 203, libelle: 'Frais de publication', montant: 5000 },
    ],
    fraisTotal: 42000,
    motif_rejet: null,
  },
  {
    id: 1003,
    numero: 'FAC-2026-1003',
    date_facture: '2026-02-05',
    montant_total: 19400,
    statut: 'REJETEE',
    dossier_reference: 'CTX-2026-00267',
    dossier_id: 4,
    client: 'Transport Logistique Nord SARL',
    avocat: 'Me. Fatima Zahra El Idrissi',
    etapeCode: 'MCV',
    etapeLibelle: 'Mesures Conservatoires',
    honorairesLignes: [
      { code: 'INJ', libelle: 'Injonction de Payer', honoraire: 3000, isCurrent: false },
      { code: 'MCV', libelle: 'Mesures Conservatoires', honoraire: 3000, isCurrent: true },
    ],
    honorairesTotal: 6000,
    fraisList: [
      { id: 301, libelle: 'Frais de saisie conservatoire', montant: 9400 },
      { id: 302, libelle: 'Frais d\'huissier', montant: 4000 },
    ],
    fraisTotal: 13400,
    motif_rejet: 'Montant des honoraires incorrect',
  },
  {
    id: 1004,
    numero: 'FAC-2026-1004',
    date_facture: '2026-02-10',
    montant_total: 35200,
    statut: 'EMISE',
    dossier_reference: 'CTX-2026-00301',
    dossier_id: 5,
    client: 'Abdelkader Tazi',
    avocat: 'Me. Nadia Cherkaoui',
    etapeCode: 'APN',
    etapeLibelle: 'Action Pénale',
    honorairesLignes: [
      { code: 'INJ', libelle: 'Injonction de Payer', honoraire: 8400, isCurrent: false },
      { code: 'ASS', libelle: 'Assignation au Paiement', honoraire: 8400, isCurrent: false },
      { code: 'APN', libelle: 'Action Pénale', honoraire: 8400, isCurrent: true },
    ],
    honorairesTotal: 25200,
    fraisList: [
      { id: 401, libelle: 'Frais de procédure pénale', montant: 10000 },
    ],
    fraisTotal: 10000,
    motif_rejet: null,
  },
  {
    id: 1005,
    numero: 'FAC-2026-1005',
    date_facture: '2026-02-18',
    montant_total: 54100,
    statut: 'EMISE',
    dossier_reference: 'CTX-2026-00378',
    dossier_id: 7,
    client: 'ElectroPro Distribution SA',
    avocat: 'Me. Youssef Amrani',
    etapeCode: 'VBM',
    etapeLibelle: 'Vente Bien Mobilier',
    honorairesLignes: [
      { code: 'INJ', libelle: 'Injonction de Payer', honoraire: 11100, isCurrent: false },
      { code: 'MCV', libelle: 'Mesures Conservatoires', honoraire: 11100, isCurrent: false },
      { code: 'VBM', libelle: 'Vente Bien Mobilier', honoraire: 11100, isCurrent: true },
    ],
    honorairesTotal: 33300,
    fraisList: [
      { id: 501, libelle: 'Frais de vente aux enchères', montant: 15000 },
      { id: 502, libelle: 'Frais de stockage', montant: 5800 },
    ],
    fraisTotal: 20800,
    motif_rejet: null,
  },
];

function App() {
  const [activePage, setActivePage] = useState('dossiers-contentieux');

  /* ===== Shared factures state (pre-populated with mock data) ===== */
  const [factures, setFactures] = useState(INITIAL_FACTURES);

  const handleEmettreFacture = (facture) => {
    setFactures((prev) => [...prev, facture]);
  };

  const handleUpdateFacture = (updatedFacture) => {
    setFactures((prev) =>
      prev.map((f) => (f.id === updatedFacture.id ? updatedFacture : f))
    );
  };

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
        return <DossiersContentieux onEmettreFacture={handleEmettreFacture} />;
      case 'avocats':
        return <GestionAvocats />;
      case 'factures-contentieux':
        return (
          <FacturesContentieux
            factures={factures}
            onUpdateFacture={handleUpdateFacture}
          />
        );
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
