import React, { useState } from 'react';
import { Download, FileText, Users, DollarSign, Calendar, X, Check } from 'lucide-react';

const ExportModal = ({ 
  isOpen, 
  onClose, 
  onExport, 
  reportesData 
}) => {
  const [formato, setFormato] = useState('csv');
  const [secciones, setSecciones] = useState({
    resumen: true,
    profesionales: true,
    pagos: true,
    estadisticas: true
  });
  const [filtros, setFiltros] = useState({
    incluirComprobantes: true,
    incluirGanancias: true,
    incluirEstados: true,
    soloCompletados: false
  });

  if (!isOpen) return null;

  const handleExport = () => {
    onExport({
      formato,
      secciones,
      filtros
    });
  };

  const toggleSeccion = (seccion) => {
    setSecciones(prev => ({
      ...prev,
      [seccion]: !prev[seccion]
    }));
  };

  const toggleFiltro = (filtro) => {
    setFiltros(prev => ({
      ...prev,
      [filtro]: !prev[filtro]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-purple-500/30 p-6 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-purple-300">Exportar Reporte</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Formato de exportación */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-3">
              Formato de Archivo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormato('csv')}
                className={`p-3 rounded-lg border transition-all flex items-center space-x-2 ${
                  formato === 'csv'
                    ? 'bg-green-600/20 text-green-300 border-green-500/30'
                    : 'bg-gray-600/20 text-gray-300 border-gray-500/30'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => setFormato('xlsx')}
                className={`p-3 rounded-lg border transition-all flex items-center space-x-2 ${
                  formato === 'xlsx'
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                    : 'bg-gray-600/20 text-gray-300 border-gray-500/30'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          {/* Secciones a incluir */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-3">
              Secciones a Incluir
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={secciones.resumen}
                  onChange={() => toggleSeccion('resumen')}
                  className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500"
                />
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Resumen General</span>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={secciones.profesionales}
                  onChange={() => toggleSeccion('profesionales')}
                  className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500"
                />
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Reporte por Profesionales</span>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={secciones.pagos}
                  onChange={() => toggleSeccion('pagos')}
                  className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500"
                />
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">Detalle de Pagos</span>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={secciones.estadisticas}
                  onChange={() => toggleSeccion('estadisticas')}
                  className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500"
                />
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">Estadísticas Avanzadas</span>
                </div>
              </label>
            </div>
          </div>

          {/* Filtros adicionales */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-3">
              Opciones Adicionales
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.incluirComprobantes}
                  onChange={() => toggleFiltro('incluirComprobantes')}
                  className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500"
                />
                <span className="text-sm">Incluir Comprobantes</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.incluirGanancias}
                  onChange={() => toggleFiltro('incluirGanancias')}
                  className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500"
                />
                <span className="text-sm">Incluir Ganancias Detalladas</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.incluirEstados}
                  onChange={() => toggleFiltro('incluirEstados')}
                  className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500"
                />
                <span className="text-sm">Incluir Estados de Pagos</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.soloCompletados}
                  onChange={() => toggleFiltro('soloCompletados')}
                  className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500"
                />
                <span className="text-sm">Solo Pagos Completados</span>
              </label>
            </div>
          </div>

          {/* Resumen de la exportación */}
          <div className="bg-black/20 rounded-xl p-4 border border-purple-500/20">
            <h4 className="text-sm font-medium text-purple-300 mb-2">Resumen de Exportación</h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div>Formato: {formato.toUpperCase()}</div>
              <div>Secciones: {Object.values(secciones).filter(Boolean).length} de 4</div>
              <div>Filtros activos: {Object.values(filtros).filter(Boolean).length} de 4</div>
              {reportesData && (
                <div>Datos disponibles: {reportesData.pagosFiltrados?.length || 0} pagos</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={!Object.values(secciones).some(Boolean)}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 