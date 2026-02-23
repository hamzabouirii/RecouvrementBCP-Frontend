import { HiOutlineCurrencyDollar, HiX } from 'react-icons/hi';

/*
  Barème types:
  - "fixe"       → flat fee per étape
  - "pourcentage" → percentage of Y
  - "mixte"       → fixed base + percentage of Y
*/

const ETAPES_LABELS = {
    AER: 'Action en Responsabilité',
    APN: 'Action Pénale',
    ASS: 'Assignation au Paiement',
    INJ: 'Injonction de Payer',
    MCV: 'Mesures Conservatoires',
    RHY: 'Réalisation Hypothécaire',
    NFC: 'Réalisation Nantissement FDC/MAT',
    PCL: 'Procédures Collectives',
    VBM: 'Vente Bien Mobilier',
};

const ETAPES_ORDER = ['INJ', 'ASS', 'MCV', 'AER', 'APN', 'RHY', 'NFC', 'VBM', 'PCL'];

/* Mock barème data per avocat */
const BAREMES_MOCK = {
    1: { type: 'pourcentage', pourcentage: 5, fixe: 0 },
    2: { type: 'fixe', pourcentage: 0, fixe: 3000 },
    3: { type: 'mixte', pourcentage: 3, fixe: 1500 },
    4: { type: 'pourcentage', pourcentage: 4, fixe: 0 },
    5: { type: 'mixte', pourcentage: 2, fixe: 2000 },
};

function calculerHonoraire(bareme, valeurY) {
    if (!bareme) return 0;
    switch (bareme.type) {
        case 'fixe':
            return bareme.fixe;
        case 'pourcentage':
            return (valeurY * bareme.pourcentage) / 100;
        case 'mixte':
            return bareme.fixe + (valeurY * bareme.pourcentage) / 100;
        default:
            return 0;
    }
}

export default function CalculHonorairesModal({ isOpen, onClose, dossier, valeurY = 0, onConfirm }) {
    if (!isOpen) return null;

    const bareme = BAREMES_MOCK[dossier?.avocatId] || BAREMES_MOCK[1];
    const etapeIdx = ETAPES_ORDER.indexOf(dossier?.etapeCode);

    /* Build cumulative honoraires per étape up to current étape */
    const etapesPassees = dossier?.historiqueEtapes || [];
    const lignes = etapesPassees.map((ep, i) => {
        const hon = calculerHonoraire(bareme, valeurY);
        return {
            code: ep,
            libelle: ETAPES_LABELS[ep] || ep,
            honoraire: hon,
            isCurrent: false,
        };
    });

    /* Current étape */
    const honCurrent = calculerHonoraire(bareme, valeurY);
    lignes.push({
        code: dossier?.etapeCode,
        libelle: ETAPES_LABELS[dossier?.etapeCode] || dossier?.etapeCode,
        honoraire: honCurrent,
        isCurrent: true,
    });

    const totalCumule = lignes.reduce((sum, l) => sum + l.honoraire, 0);

    const formatMontant = (val) =>
        new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(val);



    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <HiOutlineCurrencyDollar className="modal-icon" />
                        Calcul des Honoraires
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <HiX />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="recap-card" style={{ marginBottom: 16 }}>
                        <div className="recap-row">
                            <span className="label">Avocat</span>
                            <span className="value">{dossier?.avocat || '—'}</span>
                        </div>
                        <div className="recap-row">
                            <span className="label">Base de calcul</span>
                            <span className="value">{formatMontant(valeurY)}</span>
                        </div>
                    </div>

                    <table className="honoraires-table">
                        <thead>
                            <tr>
                                <th>Étape</th>
                                <th>Code</th>
                                <th style={{ textAlign: 'right' }}>Honoraire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lignes.map((l, i) => (
                                <tr key={i} className={l.isCurrent ? 'current' : ''}>
                                    <td>{l.libelle}</td>
                                    <td>
                                        <span className="badge badge-etape">{l.code}</span>
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatMontant(l.honoraire)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="recap-card">
                        <div className="recap-row total">
                            <span className="label">Total Honoraires Cumulés</span>
                            <span className="value">{formatMontant(totalCumule)}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={() => { onConfirm?.(totalCumule, lignes); onClose(); }}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
