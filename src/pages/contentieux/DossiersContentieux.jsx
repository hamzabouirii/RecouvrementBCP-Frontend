import { useState } from 'react';
import {
    HiOutlineSearch,
    HiOutlineScale,
    HiOutlineCalculator,
    HiOutlineCurrencyDollar,
    HiOutlinePlusCircle,
    HiOutlineDocumentText,
} from 'react-icons/hi';

import AffectationAvocatModal from '../../components/contentieux/AffectationAvocatModal';
import SelectionYModal from '../../components/contentieux/SelectionYModal';
import CalculHonorairesModal from '../../components/contentieux/CalculHonorairesModal';
import FraisSupplementairesModal from '../../components/contentieux/FraisSupplementairesModal';
import FacturationModal from '../../components/contentieux/FacturationModal';

/* ===== ÉTAPES CONTENTIEUX ===== */
const ETAPES = {
    AER: 'Action en Responsabilité',
    APN: 'Action Pénale',
    ASS: 'Assignation au Paiement',
    INJ: 'Injonction de Payer',
    MCV: 'Mesures Conservatoires',
    NFC: 'Réalisation Nantissement FDC/MAT',
    PCL: 'Procédures Collectives',
    RHY: 'Réalisation Hypothécaire',
    VBM: 'Vente Bien Mobilier',
};

/* ===== MOCK DATA (simulating batch import) ===== */
const INITIAL_DOSSIERS = [
    {
        id: 1,
        reference: 'CTX-2026-00142',
        client: 'Société Atlas Travaux SARL',
        montantDu: 485000,
        montantRecupere: 72000,
        etapeCode: 'ASS',
        etapeLibelle: ETAPES['ASS'],
        historiqueEtapes: ['INJ'],
        agence: 'Casablanca — Maarif',
        region: 'Grand Casablanca',
        statut: 'En cours',
        avocatId: 1,
        avocat: 'Me. Karim Bennani',
        factureStatut: 'Brouillon',
    },
    {
        id: 2,
        reference: 'CTX-2026-00198',
        client: 'Mohamed El Fassi',
        montantDu: 128000,
        montantRecupere: 0,
        etapeCode: 'INJ',
        etapeLibelle: ETAPES['INJ'],
        historiqueEtapes: [],
        agence: 'Rabat — Agdal',
        region: 'Rabat-Salé',
        statut: 'En cours',
        avocatId: null,
        avocat: null,
        factureStatut: null,
    },
    {
        id: 3,
        reference: 'CTX-2026-00215',
        client: 'Groupe Immobilier Zenith SA',
        montantDu: 1250000,
        montantRecupere: 340000,
        etapeCode: 'RHY',
        etapeLibelle: ETAPES['RHY'],
        historiqueEtapes: ['INJ', 'ASS', 'MCV'],
        agence: 'Tanger — Zone Franche',
        region: 'Tanger-Tétouan',
        statut: 'En cours',
        avocatId: 3,
        avocat: 'Me. Youssef Amrani',
        factureStatut: 'Émise',
    },
    {
        id: 4,
        reference: 'CTX-2026-00267',
        client: 'Transport Logistique Nord SARL',
        montantDu: 95000,
        montantRecupere: 25000,
        etapeCode: 'MCV',
        etapeLibelle: ETAPES['MCV'],
        historiqueEtapes: ['INJ'],
        agence: 'Fès — Ville Nouvelle',
        region: 'Fès-Meknès',
        statut: 'En cours',
        avocatId: 2,
        avocat: 'Me. Fatima Zahra El Idrissi',
        factureStatut: 'Brouillon',
    },
    {
        id: 5,
        reference: 'CTX-2026-00301',
        client: 'Abdelkader Tazi',
        montantDu: 210000,
        montantRecupere: 60000,
        etapeCode: 'APN',
        etapeLibelle: ETAPES['APN'],
        historiqueEtapes: ['INJ', 'ASS'],
        agence: 'Marrakech — Guéliz',
        region: 'Marrakech-Safi',
        statut: 'En cours',
        avocatId: 4,
        avocat: 'Me. Nadia Cherkaoui',
        factureStatut: 'Validée',
    },
    {
        id: 6,
        reference: 'CTX-2026-00334',
        client: 'Coopérative Agricole du Souss',
        montantDu: 670000,
        montantRecupere: 0,
        etapeCode: 'PCL',
        etapeLibelle: ETAPES['PCL'],
        historiqueEtapes: ['INJ', 'ASS', 'MCV'],
        agence: 'Agadir — Centre',
        region: 'Souss-Massa',
        statut: 'En cours',
        avocatId: 4,
        avocat: 'Me. Nadia Cherkaoui',
        factureStatut: null,
    },
    {
        id: 7,
        reference: 'CTX-2026-00378',
        client: 'ElectroPro Distribution SA',
        montantDu: 320000,
        montantRecupere: 115000,
        etapeCode: 'VBM',
        etapeLibelle: ETAPES['VBM'],
        historiqueEtapes: ['INJ', 'MCV'],
        agence: 'Kénitra — Centre',
        region: 'Rabat-Salé',
        statut: 'En cours',
        avocatId: 3,
        avocat: 'Me. Youssef Amrani',
        factureStatut: 'Brouillon',
    },
    {
        id: 8,
        reference: 'CTX-2026-00412',
        client: 'Hicham Benjelloun',
        montantDu: 78000,
        montantRecupere: 78000,
        etapeCode: 'NFC',
        etapeLibelle: ETAPES['NFC'],
        historiqueEtapes: ['INJ', 'ASS'],
        agence: 'Meknès — Hamriya',
        region: 'Fès-Meknès',
        statut: 'Clôturé',
        avocatId: 3,
        avocat: 'Me. Youssef Amrani',
        factureStatut: 'Payée',
    },
];

export default function DossiersContentieux({ onEmettreFacture }) {
    const [dossiers, setDossiers] = useState(INITIAL_DOSSIERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEtape, setFilterEtape] = useState('');
    const [filterStatut, setFilterStatut] = useState('');

    /* Modal states */
    const [activeDossier, setActiveDossier] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    /* Per-dossier data (kept in memory) */
    const [dossierData, setDossierData] = useState({});

    const getData = (id) => dossierData[id] || { valeurY: 0, typeY: null, frais: [] };

    const openModal = (dossier, modalType) => {
        setActiveDossier(dossier);
        setActiveModal(modalType);
    };

    const closeModal = () => {
        setActiveModal(null);
        setActiveDossier(null);
    };

    /* Handlers */
    const handleAffectAvocat = (avocat) => {
        setDossiers((prev) =>
            prev.map((d) =>
                d.id === activeDossier.id
                    ? { ...d, avocatId: avocat.id, avocat: avocat.nom }
                    : d
            )
        );
    };

    const handleSelectionY = ({ typeY, valeurY }) => {
        setDossierData((prev) => ({
            ...prev,
            [activeDossier.id]: { ...getData(activeDossier.id), typeY, valeurY },
        }));
    };

    const handleHonoraires = (total, lignes) => {
        /* CalculHonorairesModal callback — we don't need to store lignes anymore,
           FacturationModal computes its own. Just a no-op close. */
    };

    const handleFraisUpdate = (frais) => {
        setDossierData((prev) => ({
            ...prev,
            [activeDossier.id]: { ...getData(activeDossier.id), frais },
        }));
    };

    const handleEmettre = (lignes, honorairesTotal) => {
        const data = getData(activeDossier.id);
        const fraisTotal = data.frais.reduce((s, f) => s + f.montant, 0);

        setDossiers((prev) =>
            prev.map((d) =>
                d.id === activeDossier.id ? { ...d, factureStatut: 'Émise' } : d
            )
        );

        onEmettreFacture?.({
            id: Date.now(),
            numero: `FAC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            date_facture: new Date().toISOString().slice(0, 10),
            montant_total: honorairesTotal + fraisTotal,
            statut: 'BROUILLON',
            dossier_reference: activeDossier.reference,
            dossier_id: activeDossier.id,
            client: activeDossier.client,
            avocat: activeDossier.avocat,
            etapeCode: activeDossier.etapeCode,
            etapeLibelle: activeDossier.etapeLibelle,
            honorairesLignes: lignes,
            honorairesTotal,
            fraisList: [...data.frais],
            fraisTotal,
            motif_rejet: null,
        });
    };

    /* Filtering */
    const filteredDossiers = dossiers.filter((d) => {
        const matchSearch =
            d.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.client.toLowerCase().includes(searchTerm.toLowerCase());
        const matchEtape = filterEtape ? d.etapeCode === filterEtape : true;
        const matchStatut = filterStatut ? d.statut === filterStatut : true;
        return matchSearch && matchEtape && matchStatut;
    });

    const formatMontant = (val) =>
        new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(val);

    const statutBadge = (statut) => {
        const map = {
            'En cours': 'badge-warning',
            Clôturé: 'badge-success',
            Suspendu: 'badge-danger',
        };
        return map[statut] || 'badge-neutral';
    };

    return (
        <>
            {/* Page header */}
            <div className="page-header">
                <h1>Dossiers Contentieux</h1>
                <div className="page-header-stats">
                    <div className="stat-chip">
                        Total <span className="stat-value">{dossiers.length}</span>
                    </div>
                    <div className="stat-chip">
                        En cours <span className="stat-value">{dossiers.filter((d) => d.statut === 'En cours').length}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-input-wrapper">
                    <HiOutlineSearch className="search-icon" />
                    <input
                        className="search-input"
                        placeholder="Rechercher par référence ou client..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="filter-select"
                    value={filterEtape}
                    onChange={(e) => setFilterEtape(e.target.value)}
                >
                    <option value="">Toutes les étapes</option>
                    {Object.entries(ETAPES).map(([code, label]) => (
                        <option key={code} value={code}>
                            {code} — {label}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={filterStatut}
                    onChange={(e) => setFilterStatut(e.target.value)}
                >
                    <option value="">Tous les statuts</option>
                    <option value="En cours">En cours</option>
                    <option value="Clôturé">Clôturé</option>
                    <option value="Suspendu">Suspendu</option>
                </select>
            </div>

            {/* Data Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Référence</th>
                            <th>Client</th>
                            <th>Montant Dû</th>
                            <th>Récupéré</th>
                            <th>Étape Actuelle</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDossiers.map((dossier) => (
                            <tr key={dossier.id}>
                                <td className="cell-reference">{dossier.reference}</td>
                                <td>{dossier.client}</td>
                                <td className="cell-amount">{formatMontant(dossier.montantDu)}</td>
                                <td className="cell-amount positive">{formatMontant(dossier.montantRecupere)}</td>
                                <td>
                                    <span className="badge badge-etape">{dossier.etapeCode}</span>
                                </td>
                                <td>
                                    <span className={`badge ${statutBadge(dossier.statut)}`}>{dossier.statut}</span>
                                </td>
                                <td>
                                    <div className="actions-cell">
                                        <button className="action-btn" data-tooltip="Affecter Avocat" onClick={() => openModal(dossier, 'avocat')}>
                                            <HiOutlineScale />
                                        </button>
                                        <button className="action-btn" data-tooltip="Base de calcul" onClick={() => openModal(dossier, 'selectionY')}>
                                            <HiOutlineCalculator />
                                        </button>
                                        <button className="action-btn" data-tooltip="Honoraires" onClick={() => openModal(dossier, 'honoraires')}>
                                            <HiOutlineCurrencyDollar />
                                        </button>
                                        <button className="action-btn" data-tooltip="Frais Supp." onClick={() => openModal(dossier, 'frais')}>
                                            <HiOutlinePlusCircle />
                                        </button>
                                        <button className="action-btn" data-tooltip="Facturation" onClick={() => openModal(dossier, 'facturation')}>
                                            <HiOutlineDocumentText />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredDossiers.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>
                                    Aucun dossier trouvé
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="table-footer">
                    <span className="showing-text">
                        Affichage de {filteredDossiers.length} sur {dossiers.length} dossiers
                    </span>
                    <div className="pagination">
                        <button className="active">1</button>
                    </div>
                </div>
            </div>

            {/* ===== MODALS ===== */}
            <AffectationAvocatModal
                isOpen={activeModal === 'avocat'}
                onClose={closeModal}
                dossier={activeDossier}
                onConfirm={handleAffectAvocat}
            />

            <SelectionYModal
                isOpen={activeModal === 'selectionY'}
                onClose={closeModal}
                dossier={activeDossier}
                onConfirm={handleSelectionY}
            />

            <CalculHonorairesModal
                isOpen={activeModal === 'honoraires'}
                onClose={closeModal}
                dossier={activeDossier}
                valeurY={activeDossier ? getData(activeDossier.id).valeurY : 0}
                onConfirm={handleHonoraires}
            />

            <FraisSupplementairesModal
                isOpen={activeModal === 'frais'}
                onClose={closeModal}
                dossier={activeDossier}
                fraisList={activeDossier ? getData(activeDossier.id).frais : []}
                onUpdate={handleFraisUpdate}
            />

            <FacturationModal
                isOpen={activeModal === 'facturation'}
                onClose={closeModal}
                dossier={activeDossier}
                valeurY={activeDossier ? getData(activeDossier.id).valeurY : 0}
                fraisTotal={activeDossier ? getData(activeDossier.id).frais.reduce((s, f) => s + f.montant, 0) : 0}
                fraisList={activeDossier ? getData(activeDossier.id).frais : []}
                onEmettre={handleEmettre}
            />
        </>
    );
}
