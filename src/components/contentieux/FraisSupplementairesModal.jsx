import { useState } from 'react';
import { HiOutlinePlusCircle, HiX, HiOutlineTrash } from 'react-icons/hi';

export default function FraisSupplementairesModal({ isOpen, onClose, dossier, fraisList = [], onUpdate }) {
    const [frais, setFrais] = useState(fraisList);
    const [libelle, setLibelle] = useState('');
    const [montant, setMontant] = useState('');

    if (!isOpen) return null;

    const formatMontant = (val) =>
        new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(val);

    const totalFrais = frais.reduce((sum, f) => sum + f.montant, 0);

    const handleAdd = () => {
        if (!libelle.trim() || !montant || parseFloat(montant) <= 0) return;
        const newFrais = [...frais, { id: Date.now(), libelle: libelle.trim(), montant: parseFloat(montant) }];
        setFrais(newFrais);
        setLibelle('');
        setMontant('');
    };

    const handleRemove = (id) => {
        setFrais(frais.filter((f) => f.id !== id));
    };

    const handleSave = () => {
        onUpdate?.(frais);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <HiOutlinePlusCircle className="modal-icon" />
                        Frais Supplémentaires
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <HiX />
                    </button>
                </div>

                <div className="modal-body">
                    <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>
                        Dossier <strong style={{ color: 'var(--gray-800)' }}>{dossier?.reference}</strong> — Ajoutez les
                        frais supplémentaires liés aux procédures juridiques.
                    </p>

                    {/* Add form */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                        <div style={{ flex: 2 }}>
                            <input
                                className="form-input"
                                placeholder="Libellé du frais..."
                                value={libelle}
                                onChange={(e) => setLibelle(e.target.value)}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <input
                                className="form-input"
                                type="number"
                                placeholder="Montant (MAD)"
                                value={montant}
                                onChange={(e) => setMontant(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleAdd}
                            disabled={!libelle.trim() || !montant}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            <HiOutlinePlusCircle /> Ajouter
                        </button>
                    </div>

                    {/* List */}
                    {frais.length === 0 ? (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '32px 0',
                                color: 'var(--gray-400)',
                                fontSize: 13,
                            }}
                        >
                            Aucun frais supplémentaire ajouté
                        </div>
                    ) : (
                        <ul className="frais-list">
                            {frais.map((f) => (
                                <li key={f.id} className="frais-item">
                                    <span className="frais-label">{f.libelle}</span>
                                    <span className="frais-amount">{formatMontant(f.montant)}</span>
                                    <button className="frais-remove" onClick={() => handleRemove(f.id)}>
                                        <HiOutlineTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {frais.length > 0 && (
                        <div className="recap-card" style={{ marginTop: 16 }}>
                            <div className="recap-row total">
                                <span className="label">Total Frais Supplémentaires</span>
                                <span className="value">{formatMontant(totalFrais)}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Fermer
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Enregistrer les frais
                    </button>
                </div>
            </div>
        </div>
    );
}
