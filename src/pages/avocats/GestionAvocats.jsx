import { useState } from 'react';
import {
    HiOutlineSearch,
    HiOutlinePencilAlt,
    HiOutlinePlusCircle,
    HiOutlinePhone,
    HiOutlineMail,
} from 'react-icons/hi';
import AvocatFormModal from '../../components/avocats/AvocatFormModal';

/* ===== ÉTAPES JURIDIQUES (from DB etape_juridique) ===== */
const ETAPES_JURIDIQUES = [
    { code: 'AER', libelle: 'Action en Responsabilité' },
    { code: 'APN', libelle: 'Action Pénale' },
    { code: 'ASS', libelle: 'Assignation au Paiement' },
    { code: 'INJ', libelle: 'Injonction de Payer' },
    { code: 'MCV', libelle: 'Mesures Conservatoires' },
    { code: 'NFC', libelle: 'Réalisation Nantissement FDC/MAT' },
    { code: 'PCL', libelle: 'Procédures Collectives' },
    { code: 'RHY', libelle: 'Réalisation Hypothécaire' },
    { code: 'VBM', libelle: 'Vente Bien Mobilier' },
];

/* ===== MOCK DATA (simulating avocat table with bareme) ===== */
const INITIAL_AVOCATS = [
    {
        id: 1,
        nom: 'Me. Karim Bennani',
        email: 'k.bennani@cabinet-kb.ma',
        telephone: '0661-234567',
        statut: 'ACTIF',
        date_creation: '2024-03-15',
        baremes: [
            {
                etape_code: 'APN',
                type_calcul: 'MIXTE',
                tranches: [
                    { numero: '001', libelle: 'Tranche 1', type_calcul: 'POURCENTAGE', pourcentage: 30, montant_fixe: 0 },
                    { numero: '002', libelle: 'Tranche 2', type_calcul: 'FIXE', pourcentage: 0, montant_fixe: 0 },
                    { numero: '003', libelle: 'Tranche 3', type_calcul: 'MIXTE', pourcentage: 70, montant_fixe: 500 },
                ],
            },
            {
                etape_code: 'ASS',
                type_calcul: 'POURCENTAGE',
                tranches: [
                    { numero: '001', libelle: 'Tranche 1', type_calcul: 'POURCENTAGE', pourcentage: 50, montant_fixe: 0 },
                    { numero: '002', libelle: 'Tranche 2', type_calcul: 'POURCENTAGE', pourcentage: 50, montant_fixe: 0 },
                ],
            },
        ],
    },
    {
        id: 2,
        nom: 'Me. Fatima Zahra El Idrissi',
        email: 'fz.elidrissi@avocats-fes.ma',
        telephone: '0522-987654',
        statut: 'ACTIF',
        date_creation: '2024-05-20',
        baremes: [
            {
                etape_code: 'MCV',
                type_calcul: 'POURCENTAGE',
                tranches: [
                    { numero: '001', libelle: 'Tranche 1', type_calcul: 'POURCENTAGE', pourcentage: 40, montant_fixe: 0 },
                    { numero: '002', libelle: 'Tranche 2', type_calcul: 'POURCENTAGE', pourcentage: 60, montant_fixe: 0 },
                ],
            },
        ],
    },
    {
        id: 3,
        nom: 'Me. Youssef Amrani',
        email: 'y.amrani@amrani-law.ma',
        telephone: '0677-112233',
        statut: 'ACTIF',
        date_creation: '2023-11-01',
        baremes: [
            {
                etape_code: 'RHY',
                type_calcul: 'MIXTE',
                tranches: [
                    { numero: '001', libelle: 'Tranche 1', type_calcul: 'MIXTE', pourcentage: 25, montant_fixe: 1000 },
                    { numero: '002', libelle: 'Tranche 2', type_calcul: 'POURCENTAGE', pourcentage: 75, montant_fixe: 0 },
                ],
            },
            {
                etape_code: 'VBM',
                type_calcul: 'POURCENTAGE',
                tranches: [
                    { numero: '001', libelle: 'Tranche unique', type_calcul: 'POURCENTAGE', pourcentage: 100, montant_fixe: 0 },
                ],
            },
        ],
    },
    {
        id: 4,
        nom: 'Me. Nadia Cherkaoui',
        email: 'n.cherkaoui@cherkaoui-avocats.ma',
        telephone: '0655-445566',
        statut: 'INACTIF',
        date_creation: '2024-01-10',
        baremes: [
            {
                etape_code: 'PCL',
                type_calcul: 'FIXE',
                tranches: [
                    { numero: '001', libelle: 'Tranche 1', type_calcul: 'FIXE', pourcentage: 0, montant_fixe: 2000 },
                    { numero: '002', libelle: 'Tranche 2', type_calcul: 'FIXE', pourcentage: 0, montant_fixe: 3000 },
                ],
            },
        ],
    },
    {
        id: 5,
        nom: 'Me. Hassan Tazi',
        email: 'h.tazi@tazi-legal.ma',
        telephone: '0633-778899',
        statut: 'ACTIF',
        date_creation: '2025-02-28',
        baremes: [
            {
                etape_code: 'APN',
                type_calcul: 'POURCENTAGE',
                tranches: [
                    { numero: '001', libelle: 'Tranche 1', type_calcul: 'POURCENTAGE', pourcentage: 100, montant_fixe: 0 },
                ],
            },
            {
                etape_code: 'AER',
                type_calcul: 'MIXTE',
                tranches: [
                    { numero: '001', libelle: 'Tranche 1', type_calcul: 'POURCENTAGE', pourcentage: 20, montant_fixe: 0 },
                    { numero: '002', libelle: 'Tranche 2', type_calcul: 'MIXTE', pourcentage: 30, montant_fixe: 800 },
                    { numero: '003', libelle: 'Tranche 3', type_calcul: 'POURCENTAGE', pourcentage: 50, montant_fixe: 0 },
                ],
            },
        ],
    },
];

export default function GestionAvocats() {
    const [avocats, setAvocats] = useState(INITIAL_AVOCATS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatut, setFilterStatut] = useState('');

    /* Modal state */
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAvocat, setEditingAvocat] = useState(null);

    /* Toggle activation */
    const handleToggleStatut = (id) => {
        setAvocats((prev) =>
            prev.map((a) =>
                a.id === id
                    ? { ...a, statut: a.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF' }
                    : a
            )
        );
    };

    /* Open modal for add */
    const handleAdd = () => {
        setEditingAvocat(null);
        setModalOpen(true);
    };

    /* Open modal for edit */
    const handleEdit = (avocat) => {
        setEditingAvocat(avocat);
        setModalOpen(true);
    };

    /* Save from modal */
    const handleSave = (avocatData) => {
        if (editingAvocat) {
            setAvocats((prev) =>
                prev.map((a) => (a.id === editingAvocat.id ? { ...a, ...avocatData } : a))
            );
        } else {
            const newId = Math.max(...avocats.map((a) => a.id), 0) + 1;
            setAvocats((prev) => [
                ...prev,
                {
                    id: newId,
                    ...avocatData,
                    statut: 'ACTIF',
                    date_creation: new Date().toISOString().slice(0, 10),
                },
            ]);
        }
        setModalOpen(false);
        setEditingAvocat(null);
    };

    /* Filtering */
    const filteredAvocats = avocats.filter((a) => {
        const matchSearch =
            a.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatut = filterStatut ? a.statut === filterStatut : true;
        return matchSearch && matchStatut;
    });

    const getBaremesSummary = (baremes) => {
        if (!baremes || baremes.length === 0) return 'Aucun barème';
        return baremes.map((b) => b.etape_code).join(', ');
    };

    return (
        <>
            {/* Page header */}
            <div className="page-header">
                <div>
                    <h1>Gestion des Avocats</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="page-header-stats">
                        <div className="stat-chip">
                            Total <span className="stat-value">{avocats.length}</span>
                        </div>
                        <div className="stat-chip">
                            Actifs{' '}
                            <span className="stat-value">
                                {avocats.filter((a) => a.statut === 'ACTIF').length}
                            </span>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={handleAdd}>
                        <HiOutlinePlusCircle style={{ fontSize: 18 }} />
                        Ajouter Avocat
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-input-wrapper">
                    <HiOutlineSearch className="search-icon" />
                    <input
                        className="search-input"
                        placeholder="Rechercher par nom ou email..."
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
                    <option value="ACTIF">Actif</option>
                    <option value="INACTIF">Inactif</option>
                </select>
            </div>

            {/* Data Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Contact</th>
                            <th>Barèmes configurés</th>
                            <th>Date création</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAvocats.map((avocat) => (
                            <tr key={avocat.id}>
                                <td className="cell-reference">{avocat.nom}</td>
                                <td>
                                    <div className="avocat-contact">
                                        <span className="contact-line">
                                            <HiOutlineMail className="contact-icon" />
                                            {avocat.email}
                                        </span>
                                        <span className="contact-line">
                                            <HiOutlinePhone className="contact-icon" />
                                            {avocat.telephone}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="bareme-tags">
                                        {avocat.baremes && avocat.baremes.length > 0 ? (
                                            avocat.baremes.map((b) => (
                                                <span key={b.etape_code} className="badge badge-etape">
                                                    {b.etape_code}
                                                    <span className="bareme-count">
                                                        {b.tranches.length}T
                                                    </span>
                                                </span>
                                            ))
                                        ) : (
                                            <span style={{ color: 'var(--gray-400)', fontSize: 12 }}>
                                                Aucun barème
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                                    {new Date(avocat.date_creation).toLocaleDateString('fr-FR')}
                                </td>
                                <td>
                                    <span
                                        className={`badge ${avocat.statut === 'ACTIF'
                                                ? 'badge-success'
                                                : 'badge-danger'
                                            }`}
                                    >
                                        {avocat.statut === 'ACTIF' ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                                <td>
                                    <div className="actions-cell">
                                        <button
                                            className={`toggle-btn ${avocat.statut === 'ACTIF' ? 'active' : ''
                                                }`}
                                            data-tooltip={
                                                avocat.statut === 'ACTIF'
                                                    ? 'Désactiver'
                                                    : 'Activer'
                                            }
                                            onClick={() => handleToggleStatut(avocat.id)}
                                        >
                                            <div className="toggle-track">
                                                <div className="toggle-thumb" />
                                            </div>
                                        </button>
                                        <button
                                            className="action-btn"
                                            data-tooltip="Modifier"
                                            onClick={() => handleEdit(avocat)}
                                        >
                                            <HiOutlinePencilAlt />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredAvocats.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    style={{
                                        textAlign: 'center',
                                        padding: 40,
                                        color: 'var(--gray-400)',
                                    }}
                                >
                                    Aucun avocat trouvé
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="table-footer">
                    <span className="showing-text">
                        Affichage de {filteredAvocats.length} sur {avocats.length} avocats
                    </span>
                    <div className="pagination">
                        <button className="active">1</button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AvocatFormModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingAvocat(null);
                }}
                avocat={editingAvocat}
                onSave={handleSave}
                etapesJuridiques={ETAPES_JURIDIQUES}
            />
        </>
    );
}
