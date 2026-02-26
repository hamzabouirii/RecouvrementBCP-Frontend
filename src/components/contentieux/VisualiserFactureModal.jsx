import { HiOutlineEye, HiX } from 'react-icons/hi';

export default function VisualiserFactureModal({ isOpen, onClose, facture }) {
    if (!isOpen || !facture) return null;

    const formatMontant = (val) =>
        new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(val);

    const statutConfig = {
        BROUILLON: { class: 'badge-neutral', label: 'Brouillon' },
        EMISE: { class: 'badge-info', label: 'Émise' },
        VALIDEE: { class: 'badge-success', label: 'Validée' },
        REJETEE: { class: 'badge-danger', label: 'Rejetée' },
    };

    const st = statutConfig[facture.statut] || statutConfig.BROUILLON;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <HiOutlineEye className="modal-icon" />
                        Détail Facture
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <HiX />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Facture header info */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>Facture</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)' }}>{facture.numero}</div>
                        </div>
                        <span className={`badge ${st.class}`} style={{ fontSize: 12, padding: '5px 14px' }}>
                            {st.label}
                        </span>
                    </div>

                    {/* Dossier info */}
                    <div className="recap-card" style={{ marginBottom: 16 }}>
                        <div className="recap-row">
                            <span className="label">Dossier</span>
                            <span className="value">{facture.dossier_reference}</span>
                        </div>
                        <div className="recap-row">
                            <span className="label">Client</span>
                            <span className="value">{facture.client}</span>
                        </div>
                        <div className="recap-row">
                            <span className="label">Avocat</span>
                            <span className="value">{facture.avocat || '—'}</span>
                        </div>
                        <div className="recap-row">
                            <span className="label">Date</span>
                            <span className="value">{new Date(facture.date_facture).toLocaleDateString('fr-FR')}</span>
                        </div>
                    </div>

                    {/* Detailed honoraires */}
                    <div className="facture-lines">
                        <div
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                color: 'var(--gray-400)',
                                letterSpacing: 0.5,
                                padding: '0 0 6px',
                            }}
                        >
                            Détail des honoraires
                        </div>

                        {facture.honorairesLignes && facture.honorairesLignes.length > 0 ? (
                            facture.honorairesLignes.map((ligne, idx) => (
                                <div key={idx} className={`facture-line ${ligne.isCurrent ? 'facture-line-current' : ''}`}>
                                    <span className="line-label">
                                        <span className="badge badge-etape" style={{ fontSize: 10, padding: '1px 6px', marginRight: 8 }}>
                                            {ligne.code}
                                        </span>
                                        {ligne.libelle}
                                    </span>
                                    <span className="line-amount">{formatMontant(ligne.honoraire)}</span>
                                </div>
                            ))
                        ) : (
                            <div className="facture-line">
                                <span className="line-label"> Honoraires</span>
                                <span className="line-amount">{formatMontant(facture.honorairesTotal)}</span>
                            </div>
                        )}

                        {/* Frais supplémentaires */}
                        {facture.fraisList && facture.fraisList.length > 0 && (
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
                                {facture.fraisList.map((f) => (
                                    <div key={f.id} className="facture-line">
                                        <span className="line-label">{f.libelle}</span>
                                        <span className="line-amount">{formatMontant(f.montant)}</span>
                                    </div>
                                ))}
                            </>
                        )}

                        {(!facture.fraisList || facture.fraisList.length === 0) && (
                            <div className="facture-line">
                                <span className="line-label">Frais supplémentaires</span>
                                <span className="line-amount">{formatMontant(0)}</span>
                            </div>
                        )}
                    </div>

                    {/* Totals */}
                    <div className="recap-card">
                        <div className="recap-row">
                            <span className="label">Sous-total Honoraires</span>
                            <span className="value">{formatMontant(facture.honorairesTotal)}</span>
                        </div>
                        <div className="recap-row">
                            <span className="label">Sous-total Frais</span>
                            <span className="value">{formatMontant(facture.fraisTotal)}</span>
                        </div>
                        <div className="recap-row total">
                            <span className="label">Total Facture</span>
                            <span className="value">{formatMontant(facture.montant_total)}</span>
                        </div>
                    </div>

                    {/* Rejet motif if applicable */}
                    {facture.statut === 'REJETEE' && facture.motif_rejet && (
                        <div className="info-box warning" style={{ marginTop: 16 }}>
                            <span className="info-icon"></span>
                            <div>
                                <strong>Motif de rejet :</strong> {facture.motif_rejet}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
