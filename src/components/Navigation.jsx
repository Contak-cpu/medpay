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
    <nav className="w-full flex flex-col items-center justify-center gap-4 mb-8">
      {/* Menú móvil */}
      <div className="lg:hidden w-full">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-3 flex items-center justify-center space-x-2"
        >
          <span className="text-purple-300 font-semibold">Menú</span>
          <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {mobileMenuOpen && (
          <div className="mt-2 bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-2">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-300 hover:text-purple-300 hover:bg-purple-500/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Menú desktop centrado */}
      <div className="hidden lg:flex items-center justify-center space-x-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (setMobileMenuOpen) setMobileMenuOpen(false);
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-black/20 text-gray-300 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
} 