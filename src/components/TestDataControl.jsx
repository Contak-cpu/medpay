import React, { useState } from 'react';
import { Database, RefreshCw, Plus, Trash2, Eye, EyeOff, Settings, Users, DollarSign } from 'lucide-react';
import { shouldUseTestData, getEnvironmentInfo } from '../config/environment';

const TestDataControl = ({ 
  isTestMode, 
  toggleTestMode, 
  clearTestData, 
  generateAdditionalTestData,
  testDataCount 
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [generationOptions, setGenerationOptions] = useState({
    cantidadPagos: 5,
    cantidadProfesionales: 0,
    metodoPago: 'mixto',
    incluirPagosPendientes: true
  });
  
  const envInfo = getEnvironmentInfo();

  if (!envInfo.testDataEnabled) {
    return null; // No mostrar en producción
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-purple-500/30 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">Modo Testeo</span>
          </div>
          <button
            onClick={toggleTestMode}
            className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              isTestMode 
                ? 'bg-green-600/20 text-green-300 border border-green-500/30' 
                : 'bg-gray-600/20 text-gray-300 border border-gray-500/30'
            }`}
          >
            {isTestMode ? (
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>Activo</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <EyeOff className="w-3 h-3" />
                <span>Inactivo</span>
              </div>
            )}
          </button>
        </div>

        {isTestMode && (
          <div className="space-y-2">
            <div className="text-xs text-gray-400">
              <div>Profesionales: {testDataCount?.profesionales || 0}</div>
              <div>Pagos: {testDataCount?.pagos || 0}</div>
              <div>Logs: {testDataCount?.logs || 0}</div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => generateAdditionalTestData(generationOptions)}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 px-2 py-1 rounded-lg text-blue-300 text-xs font-medium transition-all flex items-center justify-center space-x-1"
                title="Generar datos de testeo"
              >
                <Plus className="w-3 h-3" />
                <span>Generar</span>
              </button>
              
              <button
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="flex-1 bg-purple-600/20 hover:bg-purple-600/40 px-2 py-1 rounded-lg text-purple-300 text-xs font-medium transition-all flex items-center justify-center space-x-1"
                title="Opciones avanzadas"
              >
                <Settings className="w-3 h-3" />
                <span>Opciones</span>
              </button>
              
              <button
                onClick={clearTestData}
                className="flex-1 bg-red-600/20 hover:bg-red-600/40 px-2 py-1 rounded-lg text-red-300 text-xs font-medium transition-all flex items-center justify-center space-x-1"
                title="Limpiar datos de testeo"
              >
                <Trash2 className="w-3 h-3" />
                <span>Limpiar</span>
              </button>
            </div>
            
            {/* Opciones avanzadas */}
            {showAdvancedOptions && (
              <div className="mt-3 p-3 bg-black/40 rounded-lg border border-purple-500/20">
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-purple-300 mb-1">Cantidad de Pagos</label>
                    <input
                      type="number"
                      value={generationOptions.cantidadPagos}
                      onChange={(e) => setGenerationOptions(prev => ({...prev, cantidadPagos: parseInt(e.target.value) || 0}))}
                      className="w-full px-2 py-1 bg-black/30 border border-purple-500/30 rounded text-xs text-white"
                      min="0"
                      max="50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-purple-300 mb-1">Cantidad de Profesionales</label>
                    <input
                      type="number"
                      value={generationOptions.cantidadProfesionales}
                      onChange={(e) => setGenerationOptions(prev => ({...prev, cantidadProfesionales: parseInt(e.target.value) || 0}))}
                      className="w-full px-2 py-1 bg-black/30 border border-purple-500/30 rounded text-xs text-white"
                      min="0"
                      max="10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-purple-300 mb-1">Método de Pago</label>
                    <select
                      value={generationOptions.metodoPago}
                      onChange={(e) => setGenerationOptions(prev => ({...prev, metodoPago: e.target.value}))}
                      className="w-full px-2 py-1 bg-black/30 border border-purple-500/30 rounded text-xs text-white"
                    >
                      <option value="mixto">Mixto</option>
                      <option value="efectivo">Solo Efectivo</option>
                      <option value="transferencia">Solo Transferencia</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={generationOptions.incluirPagosPendientes}
                      onChange={(e) => setGenerationOptions(prev => ({...prev, incluirPagosPendientes: e.target.checked}))}
                      className="w-3 h-3 text-purple-600 bg-black/30 border-purple-500/30 rounded"
                    />
                    <label className="text-xs text-gray-300">Incluir pagos pendientes</label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 pt-2 border-t border-purple-500/20">
          <div className="text-xs text-gray-500">
            <div>Entorno: {envInfo.environment}</div>
            <div>Versión: {envInfo.version}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDataControl; 