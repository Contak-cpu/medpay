import React from 'react';

const tabs = [
  { id: 'profesionales', label: 'Profesionales' },
  { id: 'pagos', label: 'Pagos' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'deudas', label: 'Estado de Deuda' },
  { id: 'reportes', label: 'Reportes' },
];

export default function Navigation({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <nav className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
      <div className="flex gap-2 lg:gap-6 w-full lg:w-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (setMobileMenuOpen) setMobileMenuOpen(false);
            }}
            className={`px-4 py-2 rounded-xl font-semibold border-b-4 transition-all focus:outline-none ${
              activeTab === tab.id
                ? 'border-purple-400 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-gray-300 hover:text-purple-300 hover:bg-purple-500/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
} 