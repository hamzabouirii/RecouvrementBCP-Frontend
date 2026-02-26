import { useState } from 'react';
import {
    HiOutlineSearch,
    HiOutlineEye,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
} from 'react-icons/hi';
import VisualiserFactureModal from '../../components/contentieux/VisualiserFactureModal';
import RejetFactureModal from '../../components/contentieux/RejetFactureModal';

export default function FacturesContentieux({ factures = [], onUpdateFacture }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatut, setFilterStatut] = useState('');

    /* Modal states */
    const [activeFacture, setActiveFacture] = useState(null);
    const [activeModal, setActiveModal] = useState(null); // 'visualiser' | 'rejeter'

    const closeModal = () => {
        setActiveModal(null);
        setActiveFacture(null);
    };

    /* Actions */
    const handleVisualiser = (facture) => {
        setActiveFacture(facture);
        setActiveModal('visualiser');
    };

    const handleValider = (facture) => {
        onUpdateFacture?.({ ...facture, statut: 'VALIDEE' });
    };

    const handleOpenRejet = (facture) => {
        setActiveFacture(facture);
        setActiveModal('rejeter');
    };

    const handleConfirmRejet = (motif) => {
        if (activeFacture) {
            onUpdateFacture?.({ ...activeFacture, statut: 'REJETEE', motif_rejet: motif });
        }
        closeModal();
    };

    /* Filtering */
    const filteredFactures = factures.filter((f) => {
        const matchSearch =
            f.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.dossier_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.client.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatut = filterStatut ? f.statut === filterStatut : true;
        return matchSearch && matchStatut;
    });

    const formatMontant = (val) =>
        new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(val);

    const statutConfig = {
        BROUILLON: { class: 'badge-neutral', label: 'Brouillon' },
        EMISE: { class: 'badge-info', label: 'Émise' },
        VALIDEE: { class: 'badge-success', label: 'Validée' },
        REJETEE: { class: 'badge-danger', label: 'Rejetée' },
    };

    const getStatut = (statut) => statutConfig[statut] || statutConfig.BROUILLON;

    return (
        <>
            {/* Page header */}
            <div className="page-header">
                <h1>Factures Contentieux</h1>
                <div className="page-header-stats">
                    <div className="stat-chip">
                        Total <span className="stat-value">{factures.length}</span>
                    </div>
                    <div className="stat-chip">
                        En attente{' '}
                        <span className="stat-value">
                            {factures.filter((f) => f.statut === 'BROUILLON').length}
                        </span>
                    </div>
                    <div className="stat-chip">
                        Validées{' '}
                        <span className="stat-value">
                            {factures.filter((f) => f.statut === 'VALIDEE').length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-input-wrapper">
                    <HiOutlineSearch className="search-icon" />
                    <input
                        className="search-input"
                        placeholder="Rechercher par numéro, dossier ou client..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="filter-select"
                    value={filterStatut}
                    onChange={(e) => setFilterStatut(e.target.value)}
                >
                    <option value="">Tous les statuts</option>
                    <option value="EMISE">Émise</option>
                    <option value="VALIDEE">Validée</option>
                    <option value="REJETEE">Rejetée</option>
                </select>
            </div>

            {/* Data Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>N° Facture</th>
                            <th>Dossier</th>
                            <th>Client</th>
                            <th>Avocat</th>
                            <th>Montant Total</th>
                            <th>Date</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFactures.map((facture) => {
                            const st = getStatut(facture.statut);
                            return (
                                <tr key={facture.id}>
                                    <td className="cell-reference">{facture.numero}</td>
                                    <td>
                                        {facture.dossier_reference}
                                    </td>
                                    <td>{facture.client}</td>
                                    <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                                        {facture.avocat || '—'}
                                    </td>
                                    <td className="cell-amount">{formatMontant(facture.montant_total)}</td>
                                    <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                                        {new Date(facture.date_facture).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td>
                                        <span className={`badge ${st.class}`}>{st.label}</span>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                className="action-btn"
                                                data-tooltip="Visualiser"
                                                onClick={() => handleVisualiser(facture)}
                                            >
                                                <HiOutlineEye />
                                            </button>
                                            {(facture.statut === 'EMISE') && (
                                                <>
                                                    <button
                                                        className="action-btn action-btn-success"
                                                        data-tooltip="Valider"
                                                        onClick={() => handleValider(facture)}
                                                    >
                                                        <HiOutlineCheckCircle />
                                                    </button>
                                                    <button
                                                        className="action-btn action-btn-danger"
                                                        data-tooltip="Rejeter"
                                                        onClick={() => handleOpenRejet(facture)}
                                                    >
                                                        <HiOutlineXCircle />
                                                    </button>
                                                </>
                                            )}
                                            {facture.statut === 'REJETEE' && facture.motif_rejet && (
                                                <span className="rejet-motif-hint" title={facture.motif_rejet}>

                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredFactures.length === 0 && (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>
                                    Aucune facture trouvée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="table-footer">
                    <span className="showing-text">
                        Affichage de {filteredFactures.length} sur {factures.length} factures
                    </span>
                    <div className="pagination">
                        <button className="active">1</button>
                    </div>
                </div>
            </div>

            {/* ===== MODALS ===== */}
            <VisualiserFactureModal
                isOpen={activeModal === 'visualiser'}
                onClose={closeModal}
                facture={activeFacture}
            />

            <RejetFactureModal
                isOpen={activeModal === 'rejeter'}
                onClose={closeModal}
                facture={activeFacture}
                onConfirm={handleConfirmRejet}
            />
        </>
    );
}
