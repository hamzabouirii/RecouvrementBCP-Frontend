import { useState } from 'react';
import {
  HiOutlineFolder,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineScale,
} from 'react-icons/hi';
import logo from '../images/nvlogobp.jpg';

const menuItems = [
  {
    section: 'Contentieux',
    items: [
      { id: 'dossiers-contentieux', label: 'Dossiers', icon: HiOutlineFolder },
      { id: 'avocats', label: 'Avocats', icon: HiOutlineScale },
      { id: 'factures-contentieux', label: 'Factures', icon: HiOutlineDocumentText },
    ],
  },
  {
    section: 'Amiable',
    items: [
      { id: 'dossiers-amiable', label: 'Dossiers', icon: HiOutlineFolder },
      { id: 'cabinets', label: 'Cabinets', icon: HiOutlineUserGroup },
      { id: 'factures-amiable', label: 'Factures', icon: HiOutlineDocumentText },
    ],
  },
];

export default function Sidebar({ activeItem = 'dossiers-contentieux', onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"> <img src={logo} alt="Banque Populaire Logo" style={{ width: '70px', height: 'auto' }} /> </div>
        <div className="logo-text">
          Banque Populaire
          <span>Recouvrement</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((section) => (
          <div key={section.section} className="sidebar-section">
            <div className="sidebar-section-title">{section.section}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`sidebar-link ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => onNavigate?.(item.id)}
                >
                  <Icon className="link-icon" />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
