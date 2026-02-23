import { useState } from 'react';
import { HiOutlineCalculator, HiX, HiOutlineInformationCircle } from 'react-icons/hi';

export default function SelectionYModal({ isOpen, onClose, dossier, onConfirm }) {
    const [typeY, setTypeY] = useState('recupere');
    const [montantFixe, setMontantFixe] = useState('');

    if (!isOpen) return null;

    const getValeurY = () => {
        switch (typeY) {
            case 'recupere':
                return dossier?.montantRecupere || 0;
            case 'du':
                return dossier?.montantDu || 0;
            case 'fixe':
                return parseFloat(montantFixe) || 0;
            default:
                return 0;
        }
    };

    const handleConfirm = () => {
        onConfirm?.({ typeY, valeurY: getValeurY() });
        onClose();
    };

    const formatMontant = (val) =>
        new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(val);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <HiOutlineCalculator className="modal-icon" />
                        Sélection de la Base de Calcul
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <HiX />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="info-box info">
                        <HiOutlineInformationCircle className="info-icon" />
                        <div>
                            Dossier <strong>{dossier?.reference}</strong> — Sélectionnez le montant qui servira
                            de base pour le calcul des honoraires.
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Type de montant</label>
                        <div className="radio-group">
                            <div
                                className={`radio-option ${typeY === 'recupere' ? 'selected' : ''}`}
                                onClick={() => setTypeY('recupere')}
                            >
                                <input
                                    type="radio"
                                    name="typeY"
                                    checked={typeY === 'recupere'}
                                    onChange={() => setTypeY('recupere')}
                                />
                                <div>
                                    <label style={{ fontWeight: 600, display: 'block', cursor: 'pointer' }}>
                                        Montant Récupéré
                                    </label>
                                    <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                                        {formatMontant(dossier?.montantRecupere || 0)}
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`radio-option ${typeY === 'du' ? 'selected' : ''}`}
                                onClick={() => setTypeY('du')}
                            >
                                <input
                                    type="radio"
                                    name="typeY"
                                    checked={typeY === 'du'}
                                    onChange={() => setTypeY('du')}
                                />
                                <div>
                                    <label style={{ fontWeight: 600, display: 'block', cursor: 'pointer' }}>
                                        Montant Dû
                                    </label>
                                    <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                                        {formatMontant(dossier?.montantDu || 0)}
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`radio-option ${typeY === 'fixe' ? 'selected' : ''}`}
                                onClick={() => setTypeY('fixe')}
                            >
                                <input
                                    type="radio"
                                    name="typeY"
                                    checked={typeY === 'fixe'}
                                    onChange={() => setTypeY('fixe')}
                                />
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontWeight: 600, display: 'block', cursor: 'pointer' }}>
                                        Montant Fixe (saisie libre)
                                    </label>
                                    {typeY === 'fixe' && (
                                        <input
                                            type="number"
                                            className="form-input"
                                            style={{ marginTop: 8 }}
                                            placeholder="Saisir le montant en MAD..."
                                            value={montantFixe}
                                            onChange={(e) => setMontantFixe(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            min="0"
                                            step="0.01"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="recap-card">
                        <div className="recap-row total">
                            <span className="label">Base de calcul retenue</span>
                            <span className="value">{formatMontant(getValeurY())}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Annuler
                    </button>
                    <button className="btn btn-primary" onClick={handleConfirm} disabled={getValeurY() === 0}>
                        Valider la base de calcul
                    </button>
                </div>
            </div>
        </div>
    );
}
