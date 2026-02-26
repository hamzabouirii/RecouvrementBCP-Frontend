import { useState, useEffect } from 'react';
import {
    HiX,
    HiOutlineScale,
    HiOutlineTrash,
    HiOutlinePlusCircle,
    HiOutlineCheckCircle,
    HiOutlineChevronRight,
} from 'react-icons/hi';

const EMPTY_TRANCHE = {
    numero: '',
    libelle: '',
    type_calcul: 'POURCENTAGE',
    pourcentage: 0,
    montant_fixe: 0,
};

export default function AvocatFormModal({ isOpen, onClose, avocat, onSave, etapesJuridiques }) {
    const [activeTab, setActiveTab] = useState('info');

    /* ===== Info fields ===== */
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');

    /* ===== Barème state ===== */
    const [baremes, setBaremes] = useState({}); // { [etape_code]: { tranches: [...] } }
    const [selectedEtape, setSelectedEtape] = useState(null);

    /* Initialize on open */
    useEffect(() => {
        if (isOpen) {
            if (avocat) {
                setNom(avocat.nom || '');
                setEmail(avocat.email || '');
                setTelephone(avocat.telephone || '');
                // Convert baremes array to keyed object
                const baremesObj = {};
                (avocat.baremes || []).forEach((b) => {
                    baremesObj[b.etape_code] = {
                        tranches: b.tranches.map((t) => ({ ...t })),
                    };
                });
                setBaremes(baremesObj);
                setSelectedEtape(avocat.baremes?.[0]?.etape_code || null);
            } else {
                setNom('');
                setEmail('');
                setTelephone('');
                setBaremes({});
                setSelectedEtape(null);
            }
            setActiveTab('info');
        }
    }, [isOpen, avocat]);

    if (!isOpen) return null;

    const isEdit = !!avocat;

    /* ===== Barème helpers ===== */
    const toggleEtape = (code) => {
        if (baremes[code]) {
            setSelectedEtape(code);
        } else {
            // Add this étape with an empty tranche
            setBaremes((prev) => ({
                ...prev,
                [code]: {
                    tranches: [
                        {
                            ...EMPTY_TRANCHE,
                            numero: '001',
                            libelle: 'Tranche 1',
                        },
                    ],
                },
            }));
            setSelectedEtape(code);
        }
    };

    const removeEtape = (code) => {
        setBaremes((prev) => {
            const next = { ...prev };
            delete next[code];
            return next;
        });
        if (selectedEtape === code) {
            setSelectedEtape(null);
        }
    };

    const addTranche = () => {
        if (!selectedEtape || !baremes[selectedEtape]) return;
        setBaremes((prev) => {
            const etape = { ...prev[selectedEtape] };
            const n = etape.tranches.length + 1;
            etape.tranches = [
                ...etape.tranches,
                {
                    ...EMPTY_TRANCHE,
                    numero: String(n).padStart(3, '0'),
                    libelle: `Tranche ${n}`,
                },
            ];
            return { ...prev, [selectedEtape]: etape };
        });
    };

    const removeTranche = (idx) => {
        if (!selectedEtape) return;
        setBaremes((prev) => {
            const etape = { ...prev[selectedEtape] };
            etape.tranches = etape.tranches
                .filter((_, i) => i !== idx)
                .map((t, i) => ({
                    ...t,
                    numero: String(i + 1).padStart(3, '0'),
                    libelle: `Tranche ${i + 1}`,
                }));
            return { ...prev, [selectedEtape]: etape };
        });
    };

    const updateTranche = (idx, field, value) => {
        if (!selectedEtape) return;
        setBaremes((prev) => {
            const etape = { ...prev[selectedEtape] };
            etape.tranches = etape.tranches.map((t, i) => {
                if (i !== idx) return t;
                const updated = { ...t, [field]: value };
                // Reset values when changing type
                if (field === 'type_calcul') {
                    if (value === 'POURCENTAGE') {
                        updated.montant_fixe = 0;
                    } else if (value === 'FIXE') {
                        updated.pourcentage = 0;
                        updated.montant_fixe = 0;
                    }
                }
                return updated;
            });
            return { ...prev, [selectedEtape]: etape };
        });
    };

    /* ===== Save ===== */
    const handleSubmit = () => {
        const baremesArray = Object.entries(baremes).map(([etape_code, data]) => {
            // Determine overall type_calcul for the bareme_etape
            const types = new Set(data.tranches.map((t) => t.type_calcul));
            let type_calcul = 'POURCENTAGE';
            if (types.has('MIXTE') || (types.has('FIXE') && types.has('POURCENTAGE'))) {
                type_calcul = 'MIXTE';
            } else if (types.size === 1) {
                type_calcul = [...types][0];
            }
            return {
                etape_code,
                type_calcul,
                tranches: data.tranches,
            };
        });

        onSave({
            nom,
            email,
            telephone,
            baremes: baremesArray,
        });
    };

    const currentTranches = selectedEtape && baremes[selectedEtape] ? baremes[selectedEtape].tranches : [];

    const getTrancheDescription = (t) => {
        if (t.type_calcul === 'FIXE') {
            return t.montant_fixe === 0 ? '0 (Aucun)' : `${t.montant_fixe.toLocaleString('fr-FR')} MAD fixe`;
        }
        if (t.type_calcul === 'POURCENTAGE') {
            return `${t.pourcentage}% de la base`;
        }
        if (t.type_calcul === 'MIXTE') {
            return `${t.pourcentage}% base + ${t.montant_fixe.toLocaleString('fr-FR')} MAD`;
        }
        return '—';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal avocat-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="modal-header">
                    <h2>
                        <HiOutlineScale className="modal-icon" />
                        {isEdit ? 'Modifier Avocat' : 'Ajouter un Avocat'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <HiX />
                    </button>
                </div>

                {/* Tabs */}
                <div className="avocat-tabs">
                    <button
                        className={`avocat-tab ${activeTab === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        Informations
                    </button>
                    <button
                        className={`avocat-tab ${activeTab === 'bareme' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bareme')}
                    >
                        Barème
                        {Object.keys(baremes).length > 0 && (
                            <span className="tab-count">{Object.keys(baremes).length}</span>
                        )}
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* ===== TAB: INFORMATIONS ===== */}
                    {activeTab === 'info' && (
                        <div className="avocat-info-form">
                            <div className="form-group">
                                <label className="form-label">Nom complet</label>
                                <input
                                    className="form-input"
                                    placeholder="Ex: Me. Ahmed Bennani"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                />
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        className="form-input"
                                        type="email"
                                        placeholder="avocat@cabinet.ma"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Téléphone</label>
                                    <input
                                        className="form-input"
                                        placeholder="0661-XXXXXX"
                                        value={telephone}
                                        onChange={(e) => setTelephone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB: BARÈME ===== */}
                    {activeTab === 'bareme' && (
                        <div className="bareme-layout">
                            {/* Left: étapes list */}
                            <div className="bareme-etapes-list">
                                <div className="bareme-etapes-title">Étapes juridiques</div>
                                {etapesJuridiques.map((etape) => {
                                    const isConfigured = !!baremes[etape.code];
                                    const isSelected = selectedEtape === etape.code;
                                    return (
                                        <div
                                            key={etape.code}
                                            className={`bareme-etape-item ${isSelected ? 'selected' : ''} ${isConfigured ? 'configured' : ''}`}
                                            onClick={() => toggleEtape(etape.code)}
                                        >
                                            <div className="etape-item-left">
                                                {isConfigured && (
                                                    <HiOutlineCheckCircle className="etape-check" />
                                                )}
                                                <div>
                                                    <span className="etape-code">{etape.code}</span>
                                                    <span className="etape-libelle">{etape.libelle}</span>
                                                </div>
                                            </div>
                                            <HiOutlineChevronRight className="etape-arrow" />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right: tranches config */}
                            <div className="bareme-tranches-panel">
                                {selectedEtape && baremes[selectedEtape] ? (
                                    <>
                                        <div className="tranches-header">
                                            <div>
                                                <span className="tranches-title">
                                                    Tranches — {selectedEtape}
                                                </span>
                                                <span className="tranches-subtitle">
                                                    {etapesJuridiques.find((e) => e.code === selectedEtape)?.libelle}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    style={{ color: 'var(--status-danger)', borderColor: 'var(--status-danger)' }}
                                                    onClick={() => removeEtape(selectedEtape)}
                                                >
                                                    <HiOutlineTrash style={{ fontSize: 14 }} />
                                                    Retirer
                                                </button>
                                                <button className="btn btn-sm btn-primary" onClick={addTranche}>
                                                    <HiOutlinePlusCircle style={{ fontSize: 14 }} />
                                                    Tranche
                                                </button>
                                            </div>
                                        </div>

                                        <div className="tranches-list">
                                            {currentTranches.map((tranche, idx) => (
                                                <div key={idx} className="tranche-card">
                                                    <div className="tranche-card-header">
                                                        <span className="tranche-numero">{tranche.numero}</span>
                                                        <span className="tranche-desc">
                                                            {getTrancheDescription(tranche)}
                                                        </span>
                                                        {currentTranches.length > 1 && (
                                                            <button
                                                                className="tranche-remove"
                                                                onClick={() => removeTranche(idx)}
                                                            >
                                                                <HiOutlineTrash />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="tranche-config">
                                                        <div className="tranche-type-selector">
                                                            <button
                                                                className={`tranche-type-btn ${tranche.type_calcul === 'POURCENTAGE' ? 'active' : ''}`}
                                                                onClick={() => updateTranche(idx, 'type_calcul', 'POURCENTAGE')}
                                                            >
                                                                % Base
                                                            </button>
                                                            <button
                                                                className={`tranche-type-btn ${tranche.type_calcul === 'FIXE' ? 'active' : ''}`}
                                                                onClick={() => updateTranche(idx, 'type_calcul', 'FIXE')}
                                                            >
                                                                Aucun (0)
                                                            </button>
                                                            <button
                                                                className={`tranche-type-btn ${tranche.type_calcul === 'MIXTE' ? 'active' : ''}`}
                                                                onClick={() => updateTranche(idx, 'type_calcul', 'MIXTE')}
                                                            >
                                                                Fixe + %
                                                            </button>
                                                        </div>
                                                        <div className="tranche-inputs">
                                                            {(tranche.type_calcul === 'POURCENTAGE' || tranche.type_calcul === 'MIXTE') && (
                                                                <div className="tranche-input-group">
                                                                    <label>Pourcentage</label>
                                                                    <div className="input-with-suffix">
                                                                        <input
                                                                            type="number"
                                                                            className="form-input"
                                                                            min="0"
                                                                            max="100"
                                                                            value={tranche.pourcentage}
                                                                            onChange={(e) =>
                                                                                updateTranche(idx, 'pourcentage', parseFloat(e.target.value) || 0)
                                                                            }
                                                                        />
                                                                        <span className="input-suffix">%</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {tranche.type_calcul === 'MIXTE' && (
                                                                <div className="tranche-input-group">
                                                                    <label>Montant fixe</label>
                                                                    <div className="input-with-suffix">
                                                                        <input
                                                                            type="number"
                                                                            className="form-input"
                                                                            min="0"
                                                                            value={tranche.montant_fixe}
                                                                            onChange={(e) =>
                                                                                updateTranche(idx, 'montant_fixe', parseFloat(e.target.value) || 0)
                                                                            }
                                                                        />
                                                                        <span className="input-suffix">MAD</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="tranches-empty">
                                        <HiOutlineScale style={{ fontSize: 40, color: 'var(--gray-300)' }} />
                                        <p>Sélectionnez une étape juridique pour configurer son barème</p>
                                        <span>Cliquez sur une étape à gauche pour ajouter des tranches</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Annuler
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={!nom.trim()}
                    >
                        {isEdit ? 'Enregistrer les modifications' : 'Ajouter l\'avocat'}
                    </button>
                </div>
            </div>
        </div>
    );
}
