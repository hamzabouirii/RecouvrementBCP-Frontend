import { useState } from 'react';
import { HiOutlineXCircle, HiX } from 'react-icons/hi';

const MOTIFS_REJET = [
    'Montant des honoraires incorrect',
    'Frais supplémentaires non justifiés',
    'Dossier non conforme aux procédures',
    'Étape juridique non validée',
    'Informations du client manquantes ou erronées',
    'Erreur de calcul dans la facturation',
    'Avocat non habilité pour cette étape',
    'Documents justificatifs manquants',
    'Duplication de facture',
];

export default function RejetFactureModal({ isOpen, onClose, facture, onConfirm }) {
    const [selectedMotif, setSelectedMotif] = useState('');
    const [customMotif, setCustomMotif] = useState('');
    const [useCustom, setUseCustom] = useState(false);

    if (!isOpen || !facture) return null;

    const handleConfirm = () => {
        const motif = useCustom ? customMotif.trim() : selectedMotif;
        if (!motif) return;
        onConfirm?.(motif);
        setSelectedMotif('');
        setCustomMotif('');
        setUseCustom(false);
    };

    const handleSelectMotif = (motif) => {
        setSelectedMotif(motif);
        setUseCustom(false);
    };

    const handleCustomToggle = () => {
        setUseCustom(true);
        setSelectedMotif('');
    };

    const isValid = useCustom ? customMotif.trim().length > 0 : selectedMotif.length > 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <HiOutlineXCircle className="modal-icon" style={{ color: 'var(--status-danger)' }} />
                        Rejeter la Facture
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <HiX />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Facture info */}
                    <div className="recap-card" style={{ marginBottom: 20 }}>
                        <div className="recap-row">
                            <span className="label">Facture</span>
                            <span className="value">{facture.numero}</span>
                        </div>
                        <div className="recap-row">
                            <span className="label">Dossier</span>
                            <span className="value">{facture.dossier_reference}</span>
                        </div>
                        <div className="recap-row">
                            <span className="label">Client</span>
                            <span className="value">{facture.client}</span>
                        </div>
                    </div>

                    {/* Motif selection */}
                    <div className="form-group">
                        <label className="form-label">Sélectionnez le motif de rejet</label>
                        <div className="radio-group">
                            {MOTIFS_REJET.map((motif) => (
                                <div
                                    key={motif}
                                    className={`radio-option ${!useCustom && selectedMotif === motif ? 'selected' : ''}`}
                                    onClick={() => handleSelectMotif(motif)}
                                >
                                    <input
                                        type="radio"
                                        name="motif-rejet"
                                        checked={!useCustom && selectedMotif === motif}
                                        onChange={() => handleSelectMotif(motif)}
                                    />
                                    <label>{motif}</label>
                                </div>
                            ))}

                            {/* Custom motif option */}
                            <div
                                className={`radio-option ${useCustom ? 'selected' : ''}`}
                                onClick={handleCustomToggle}
                            >
                                <input
                                    type="radio"
                                    name="motif-rejet"
                                    checked={useCustom}
                                    onChange={handleCustomToggle}
                                />
                                <label>Autre motif (saisir manuellement)</label>
                            </div>
                        </div>
                    </div>

                    {/* Custom text area */}
                    {useCustom && (
                        <div className="form-group" style={{ marginTop: 12 }}>
                            <label className="form-label">Précisez le motif</label>
                            <textarea
                                className="form-input"
                                rows={3}
                                placeholder="Saisissez le motif de rejet..."
                                value={customMotif}
                                onChange={(e) => setCustomMotif(e.target.value)}
                                style={{ resize: 'vertical', minHeight: 80 }}
                            />
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Annuler
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={handleConfirm}
                        disabled={!isValid}
                    >
                        <HiOutlineXCircle /> Confirmer le rejet
                    </button>
                </div>
            </div>
        </div>
    );
}
