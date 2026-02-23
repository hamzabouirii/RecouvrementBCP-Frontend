import { HiOutlineDocumentText, HiX, HiOutlineInformationCircle } from 'react-icons/hi';

export default function FacturationModal({ isOpen, onClose, dossier, honorairesTotal = 0, fraisTotal = 0, fraisList = [], onEmettre }) {
    if (!isOpen) return null;

    const total = honorairesTotal + fraisTotal;

    const formatMontant = (val) =>
        new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(val);

    const statut = dossier?.factureStatut || 'Brouillon';

    const statutConfig = {
        Brouillon: { class: 'badge-neutral', label: 'Brouillon' },
        Émise: { class: 'badge-info', label: 'Émise' },
        Validée: { class: 'badge-success', label: 'Validée' },
        Rejetée: { class: 'badge-danger', label: 'Rejetée' },
        Payée: { class: 'badge-success', label: 'Payée' },
    };

    const currentStatut = statutConfig[statut] || statutConfig.Brouillon;

    const handleEmettre = () => {
        onEmettre?.();
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <HiOutlineDocumentText className="modal-icon" />
                        Facturation
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <HiX />
                    </button>
                </div>

                <div className="modal-body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>Dossier</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)' }}>{dossier?.reference}</div>
                        </div>
                        <span className={`badge ${currentStatut.class}`} style={{ fontSize: 12, padding: '5px 14px' }}>
                            {currentStatut.label}
                        </span>
                    </div>

                    <div className="info-box info">
                        <HiOutlineInformationCircle className="info-icon" />
                        <div>
                            Récapitulatif de la facture incluant les honoraires cumulés et les frais supplémentaires.
                        </div>
                    </div>

                    {/* Lignes de détail */}
                    <div className="facture-lines">
                        <div className="facture-line">
                            <span className="line-label">📋 Honoraires (cumulés)</span>
                            <span className="line-amount">{formatMontant(honorairesTotal)}</span>
                        </div>

                        {fraisList.length > 0 && (
                            <>
                                <div
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        color: 'var(--gray-400)',
                                        letterSpacing: 0.5,
                                        padding: '10px 0 4px',
                                    }}
                                >
                                    Frais supplémentaires
                                </div>
                                {fraisList.map((f) => (
                                    <div key={f.id} className="facture-line">
                                        <span className="line-label">{f.libelle}</span>
                                        <span className="line-amount">{formatMontant(f.montant)}</span>
                                    </div>
                                ))}
                            </>
                        )}

                        {fraisList.length === 0 && (
                            <div className="facture-line">
                                <span className="line-label">📎 Frais supplémentaires</span>
                                <span className="line-amount">{formatMontant(0)}</span>
                            </div>
                        )}
                    </div>

                    <div className="recap-card">
                        <div className="recap-row">
                            <span className="label">Sous-total Honoraires</span>
                            <span className="value">{formatMontant(honorairesTotal)}</span>
                        </div>
                        <div className="recap-row">
                            <span className="label">Sous-total Frais</span>
                            <span className="value">{formatMontant(fraisTotal)}</span>
                        </div>
                        <div className="recap-row total">
                            <span className="label">Total Facture</span>
                            <span className="value">{formatMontant(total)}</span>
                        </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <div className="recap-row" style={{ padding: '4px 0' }}>
                            <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>Date</span>
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-700)' }}>
                                {new Date().toLocaleDateString('fr-FR')}
                            </span>
                        </div>
                        <div className="recap-row" style={{ padding: '4px 0' }}>
                            <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>Avocat</span>
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-700)' }}>
                                {dossier?.avocat || '—'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Annuler
                    </button>
                    <button className="btn btn-primary" onClick={handleEmettre}>
                        <HiOutlineDocumentText /> Émettre la Facture
                    </button>
                </div>
            </div>
        </div>
    );
}
