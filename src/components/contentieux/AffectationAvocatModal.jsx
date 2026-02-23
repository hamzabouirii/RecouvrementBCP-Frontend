import { useState } from 'react';
import { HiOutlineScale, HiX, HiOutlineInformationCircle } from 'react-icons/hi';

const AVOCATS_MOCK = [
    { id: 1, nom: 'Me. Karim Bennani', specialite: 'Contentieux Bancaire', statut: 'Actif', etapes: ['ASS', 'INJ', 'RHY'] },
    { id: 2, nom: 'Me. Fatima Zahra El Idrissi', specialite: 'Droit Commercial', statut: 'Actif', etapes: ['MCV', 'NFC', 'PCL'] },
    { id: 3, nom: 'Me. Youssef Amrani', specialite: 'Droit des Sûretés', statut: 'Actif', etapes: ['RHY', 'VBM', 'NFC'] },
    { id: 4, nom: 'Me. Nadia Cherkaoui', specialite: 'Procédures Collectives', statut: 'Actif', etapes: ['PCL', 'AER', 'APN'] },
    { id: 5, nom: 'Me. Hassan Tazi', specialite: 'Contentieux Pénal', statut: 'Actif', etapes: ['APN', 'AER', 'ASS'] },
];

export default function AffectationAvocatModal({ isOpen, onClose, dossier, onConfirm }) {
    const [selectedAvocat, setSelectedAvocat] = useState(dossier?.avocatId || null);

    if (!isOpen) return null;

    const avocatsDisponibles = AVOCATS_MOCK.filter(
        (a) => a.statut === 'Actif' && a.etapes.includes(dossier?.etapeCode)
    );

    const handleConfirm = () => {
        const avocat = AVOCATS_MOCK.find((a) => a.id === selectedAvocat);
        onConfirm?.(avocat);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <HiOutlineScale className="modal-icon" />
                        Affecter un Avocat
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <HiX />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="info-box info">
                        <HiOutlineInformationCircle className="info-icon" />
                        <div>
                            Dossier <strong>{dossier?.reference}</strong> — Étape actuelle :{' '}
                            <strong>{dossier?.etapeLibelle}</strong>
                        </div>
                    </div>

                    {dossier?.avocat && (
                        <div className="recap-card" style={{ marginBottom: 16 }}>
                            <div className="recap-row">
                                <span className="label">Avocat actuel</span>
                                <span className="value">{dossier.avocat}</span>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Sélectionner un avocat actif</label>
                        <div className="radio-group">
                            {avocatsDisponibles.length === 0 && (
                                <div className="info-box warning">
                                    <HiOutlineInformationCircle className="info-icon" />
                                    <div>Aucun avocat configuré pour l'étape <strong>{dossier?.etapeCode}</strong>.</div>
                                </div>
                            )}
                            {avocatsDisponibles.map((avocat) => (
                                <div
                                    key={avocat.id}
                                    className={`radio-option ${selectedAvocat === avocat.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedAvocat(avocat.id)}
                                >
                                    <input
                                        type="radio"
                                        name="avocat"
                                        checked={selectedAvocat === avocat.id}
                                        onChange={() => setSelectedAvocat(avocat.id)}
                                    />
                                    <div>
                                        <label style={{ fontWeight: 600, display: 'block' }}>{avocat.nom}</label>
                                        <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>{avocat.specialite}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Annuler
                    </button>
                    <button className="btn btn-primary" onClick={handleConfirm} disabled={!selectedAvocat}>
                        Confirmer l'affectation
                    </button>
                </div>
            </div>
        </div>
    );
}
