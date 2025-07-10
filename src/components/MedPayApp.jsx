import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Plus, User, CreditCard, DollarSign, Calendar, TrendingUp, Zap, Upload, Check, Clock, FileImage, X, Menu, AlertCircle } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import useValidation from '../hooks/useValidation';
import useNotifications from '../hooks/useNotifications';
import { useOptimizedCalculations } from '../hooks/useOptimizedCalculations';
import Navigation from './Navigation';
import useMedPayStore from '../store/useMedPayStore';

// Lazy loading para componentes pesados
const ProfesionalesList = React.lazy(() => import('./Profesionales/ProfesionalesList'));
const AddProfesionalModal = React.lazy(() => import('./Profesionales/AddProfesionalModal'));
const ProfesionalDetail = React.lazy(() => import('./Profesionales/ProfesionalDetail'));
const PagosList = React.lazy(() => import('./Pagos/PagosList'));
const AddPagoModal = React.lazy(() => import('./Pagos/AddPagoModal'));
const Dashboard = React.lazy(() => import('./Dashboard/Dashboard'));
const Deudas = React.lazy(() => import('./Deudas/Deudas'));
const Reportes = React.lazy(() => import('./Reportes/Reportes'));
const RegistroPagos = React.lazy(() => import('./RegistroPagos/RegistroPagos'));
const Profesionales = React.lazy(() => import('./Profesionales/Profesionales'));
const TestDataControl = React.lazy(() => import('./TestDataControl'));
const MarcarPagoModal = React.lazy(() => import('./Deudas/MarcarPagoModal'));
const ExportModal = React.lazy(() => import('./Reportes/ExportModal'));
const NotificationSystem = React.lazy(() => import('./NotificationSystem'));
const ComprobanteModal = React.lazy(() => import('./Deudas/ComprobanteModal'));

// Componente de loading optimizado
const LoadingSpinner = ({ message = "Cargando..." }) => (
  <div className="flex items-center justify-center p-4">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-purple-300 text-sm">{message}</p>
    </div>
  </div>
);

// Wrapper para componentes lazy
const LazyComponent = ({ children, fallback = <LoadingSpinner /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

const ConsultorioPagosApp = () => {
  // TODOS LOS HOOKS DEBEN IR AL INICIO
  const [activeTab, setActiveTab] = useState('profesionales');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAddProfesional, setShowAddProfesional] = useState(false);
  const [showComprobanteModal, setShowComprobanteModal] = useState(false);
  const [comprobanteData, setComprobanteData] = useState(null);
  const [pagoParaComprobar, setPagoParaComprobar] = useState(null);
  const [comprobantes, setComprobantes] = useState({
    profesional: '',
    clinica: ''
  });
  const [showMarcarPagoModal, setShowMarcarPagoModal] = useState(false);
  const [pagoParaMarcar, setPagoParaMarcar] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSubmittingProfesional, setIsSubmittingProfesional] = useState(false);
  const [isSubmittingPago, setIsSubmittingPago] = useState(false);
  const [showAddPago, setShowAddPago] = useState(false);
  const [profesionalDetallado, setProfesionalDetallado] = useState(null);
  const [newProfesional, setNewProfesional] = useState({
    nombre: '',
    especialidad: '',
    porcentaje: '',
    valorTurno: ''
  });
  const [erroresProfesional, setErroresProfesional] = useState({
    nombre: '',
    especialidad: '',
    porcentaje: '',
    valorTurno: ''
  });
  const [newPago, setNewPago] = useState({
    profesionalId: '',
    paciente: '',
    metodoPago: 'efectivo',
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:00',
    monto: '',
    comprobante: ''
  });

  // Hooks de terceros
  const { showSuccess, showError, showWarning, showInfo, notifications, removeNotification } = useNotifications();
  const profesionalValidation = useValidation('profesional');
  const pagoValidation = useValidation('pago');
  
  // Zustand hooks
  const profesionales = useMedPayStore(state => state.profesionales);
  const pagos = useMedPayStore(state => state.pagos);
  const filtros = useMedPayStore(state => state.filtros);
  const filtrosReportes = useMedPayStore(state => state.filtrosReportes);
  const setProfesionales = useMedPayStore(state => state.setProfesionales);
  const setPagos = useMedPayStore(state => state.setPagos);
  const setFiltros = useMedPayStore(state => state.setFiltros);
  const setFiltrosReportes = useMedPayStore(state => state.setFiltrosReportes);
  
  // Hook de Supabase
  const {
    loading,
    error,
    addProfesional,
    updateProfesional,
    addPago,
    updatePago,
    markPagoAsCompleted,
    addLog,
    clearAllData,
    refreshData,
    deleteProfesional,
    deletePago,
    isTestMode,
    testDataHook
  } = useSupabase({
    setProfesionales,
    setPagos
  });

  // Cálculos optimizados
  const { estadisticas, pagosFiltrados, reportes, calcularDetallesProfesional } = useOptimizedCalculations(
    pagos, 
    profesionales, 
    filtros
  );

  // Validaciones optimizadas usando el hook centralizado
  const validarProfesionalCompleto = useCallback(() => {
    const { isValid, errors } = profesionalValidation.validateForm(newProfesional);
    setErroresProfesional(errors);
    return isValid;
  }, [newProfesional, profesionalValidation]);

  // AHORA SÍ PODEMOS TENER LA LÓGICA CONDICIONAL
  const renderContent = () => {
    // Mostrar error si hay problema con Supabase
    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-4">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-red-500/20 p-8 max-w-md w-full">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-400 mb-4">Error de Conexión</h2>
              <p className="text-gray-300 mb-4">
                No se pudo conectar con la base de datos. Verifica tu conexión a internet y las variables de entorno.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Error: {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Mostrar loading solo si está cargando Y no hay datos iniciales
    if (loading && profesionales.length === 0 && pagos.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-4">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-purple-500/20 p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Cargando...</h2>
              <p className="text-gray-300">
                Conectando con la base de datos
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Contenido principal de la aplicación
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/logo.png" 
                    alt="Logo MedPay" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden items-center justify-center w-full h-full">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    MedPay AI
                  </h1>
                  <p className="text-purple-300 text-sm sm:text-base">Sistema de Gestión de Pagos</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-purple-300">Hoy</p>
                  <p className="text-sm sm:text-lg font-semibold">{new Date().toLocaleDateString('es-AR')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Sistema de notificaciones optimizado */}
          <LazyComponent>
            <ComprobanteModal
              isOpen={showComprobanteModal}
              onConfirm={handleComprobanteConfirm}
              onCancel={handleComprobanteCancel}
              title="Ingresar Comprobantes"
              message={comprobanteData?.sinComprobante ? 
                "Algunos pagos no tienen comprobante del profesional. Puedes ingresar uno general." : 
                "Ingresa los comprobantes de pago (opcional)."
              }
            />
          </LazyComponent>

          <LazyComponent>
            <NotificationSystem
              notifications={notifications}
              removeNotification={removeNotification}
            />
          </LazyComponent>
          
          {/* Tab: Profesionales */}
          {activeTab === 'profesionales' && (
            <LazyComponent fallback={<LoadingSpinner message="Cargando profesionales..." />}>
              <Profesionales
                profesionales={profesionales}
                showAddProfesional={showAddProfesional}
                setShowAddProfesional={setShowAddProfesional}
                newProfesional={newProfesional}
                erroresProfesional={erroresProfesional}
                setNewProfesional={setNewProfesional}
                setErroresProfesional={setErroresProfesional}
                handleAddProfesional={handleAddProfesional}
                isSubmittingProfesional={isSubmittingProfesional}
                profesionalDetallado={profesionalDetallado}
                setProfesionalDetallado={setProfesionalDetallado}
                deleteProfesional={deleteProfesional}
                updateProfesional={updateProfesional}
                refreshData={refreshData}
                showSuccessNotification={showSuccess}
                validarProfesionalCompleto={validarProfesionalCompleto}
                calcularDetallesProfesional={calcularDetallesProfesional}
              />
            </LazyComponent>
          )}

          {/* Tab: Registro de Pagos */}
          {activeTab === 'registro' && (
            <LazyComponent fallback={<LoadingSpinner message="Cargando registro..." />}>
              <RegistroPagos
                newPago={newPago}
                setNewPago={setNewPago}
                profesionales={profesionales}
                handleAddPago={handleAddPago}
              />
            </LazyComponent>
          )}

          {/* Tab: Dashboard */}
          {activeTab === 'dashboard' && (
            <LazyComponent fallback={<LoadingSpinner message="Cargando dashboard..." />}>
              <Dashboard 
                stats={estadisticas}
                pagos={pagos}
                getEstadoColor={getEstadoColor}
              />
            </LazyComponent>
          )}

          {/* Tab: Estado de Deudas */}
          {activeTab === 'deudas' && (
            <LazyComponent fallback={<LoadingSpinner message="Cargando deudas..." />}>
              <Deudas
                filtros={filtros}
                setFiltros={setFiltros}
                profesionales={profesionales}
                pagos={pagos}
                stats={estadisticas}
                aplicarFiltros={aplicarFiltros}
                getEstadoColor={getEstadoColor}
                getEstadoTexto={getEstadoTexto}
                marcarPagoIndividual={marcarPagoIndividual}
                marcarEfectivoPagado={marcarEfectivoPagado}
                marcarTransferenciasCobradas={marcarTransferenciasCobradas}
              />
            </LazyComponent>
          )}
          
          {/* Tab: Reportes */}
          {activeTab === 'reportes' && (
            <LazyComponent fallback={<LoadingSpinner message="Cargando reportes..." />}>
              <Reportes
                filtrosReportes={filtrosReportes}
                setFiltrosReportes={setFiltrosReportes}
                profesionales={profesionales}
                calcularReportes={calcularReportes}
                exportarReporteCSV={exportarReporteCSV}
                profesionalDetallado={profesionalDetallado}
                setProfesionalDetallado={setProfesionalDetallado}
                calcularDetallesProfesional={calcularDetallesProfesional}
                getEstadoColor={getEstadoColor}
                onShowExportModal={() => setShowExportModal(true)}
              />
            </LazyComponent>
          )}

          {/* Tab: Pagos */}
          {activeTab === 'pagos' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Gestión de Pagos
                </h2>
                <button
                  onClick={() => setShowAddPago(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] flex items-center space-x-2 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Registrar Pago</span>
                </button>
              </div>
              <LazyComponent fallback={<LoadingSpinner message="Cargando pagos..." />}>
                <PagosList
                  pagos={pagos}
                  profesionales={profesionales}
                  onSelect={(pago) => {
                    console.log('Pago seleccionado:', pago);
                  }}
                  onDelete={async id => {
                    if (window.confirm('¿Seguro que deseas eliminar este pago?')) {
                      await deletePago(id);
                      await refreshData();
                      showSuccess('Pago eliminado');
                    }
                  }}
                />
              </LazyComponent>
              {showAddPago && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                  <LazyComponent fallback={<LoadingSpinner message="Cargando modal..." />}>
                    <AddPagoModal
                      values={newPago}
                      errores={{
                        profesionalId: !newPago.profesionalId ? 'El profesional es obligatorio' : '',
                        paciente: !newPago.paciente ? 'El paciente es obligatorio' : '',
                        monto: !newPago.monto ? 'El monto es obligatorio' : ''
                      }}
                      profesionales={profesionales}
                      onChange={(field, value) => setNewPago({ ...newPago, [field]: value })}
                      onSubmit={handleAddPago}
                      onCancel={() => setShowAddPago(false)}
                      loading={isSubmittingPago}
                    />
                  </LazyComponent>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modales */}
        <LazyComponent>
          <MarcarPagoModal
            pago={pagoParaMarcar}
            isOpen={showMarcarPagoModal}
            onConfirm={handleMarcarPago}
            onCancel={() => {
              setShowMarcarPagoModal(false);
              setPagoParaMarcar(null);
            }}
          />
        </LazyComponent>

        <LazyComponent>
          <ComprobanteModal
            isOpen={showComprobanteModal}
            onConfirm={handleComprobanteConfirm}
            onCancel={handleComprobanteCancel}
            profesionalId={comprobanteData?.profesionalId}
            pagosAfectados={comprobanteData?.pagosAfectados}
            sinComprobante={comprobanteData?.sinComprobante}
          />
        </LazyComponent>

        <LazyComponent>
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            onExport={handleExportReporte}
            reportesData={calcularReportes()}
          />
        </LazyComponent>

        <LazyComponent>
          <TestDataControl
            isTestMode={isTestMode}
            toggleTestMode={testDataHook?.toggleTestMode}
            clearTestData={testDataHook?.clearTestData}
            generateAdditionalTestData={testDataHook?.generateAdditionalTestData}
            testDataCount={{
              profesionales: profesionales.length,
              pagos: pagos.length,
              logs: testDataHook?.logs?.length || 0
            }}
          />
        </LazyComponent>
      </div>
    );
  };

  // Funciones que necesitan estar definidas antes del render
  const handleAddProfesional = async () => {
    if (validarProfesionalCompleto()) {
      setIsSubmittingProfesional(true);
      try {
        const profesionalData = {
          nombre: newProfesional.nombre.trim(),
          especialidad: newProfesional.especialidad.trim(),
          porcentaje: parseFloat(newProfesional.porcentaje),
          valor_turno: parseFloat(newProfesional.valorTurno)
        };
        
        await addProfesional(profesionalData);
        await refreshData();
        
        setNewProfesional({ nombre: '', especialidad: '', porcentaje: '', valorTurno: '' });
        setErroresProfesional({ nombre: '', especialidad: '', porcentaje: '', valorTurno: '' });
        setShowAddProfesional(false);
        setActiveTab('profesionales');
        
        showSuccess('Profesional agregado con éxito');
      } catch (error) {
        console.error('Error adding profesional:', error);
        showError('Error al agregar profesional: ' + (error.message || 'Error desconocido'));
      } finally {
        setIsSubmittingProfesional(false);
      }
    }
  };

  const handleAddPago = async () => {
    if (newPago.profesionalId && newPago.paciente && newPago.monto) {
      try {
        const profesional = profesionales.find(p => p.id === parseInt(newPago.profesionalId));
        const monto = parseFloat(newPago.monto);
        
        const pagoData = {
          profesionalId: parseInt(newPago.profesionalId),
          profesionalNombre: profesional.nombre,
          paciente: newPago.paciente,
          metodoPago: newPago.metodoPago,
          fecha: newPago.fecha,
          hora: newPago.hora,
          monto: monto,
          porcentajeProfesional: profesional.porcentaje,
          gananciaProfesional: monto * (profesional.porcentaje / 100),
          gananciaClinica: monto * ((100 - profesional.porcentaje) / 100),
          estado: newPago.metodoPago === 'efectivo' ? 'pendiente' : 'recibida',
          comprobante: newPago.comprobante || null,
          comprobanteClinica: null
        };
        
        await addPago(pagoData);
        await refreshData();
        
        setNewPago({
          profesionalId: '',
          paciente: '',
          metodoPago: 'efectivo',
          fecha: new Date().toISOString().split('T')[0],
          hora: '09:00',
          monto: '',
          comprobante: ''
        });
        
        setShowAddPago(false);
        showSuccess('Pago registrado con éxito');
      } catch (error) {
        console.error('Error adding pago:', error);
        showError('Error al registrar pago: ' + (error.message || 'Error desconocido'));
      }
    } else {
      showWarning('Por favor completa todos los campos obligatorios');
    }
  };

  const marcarPagoIndividual = (pagoId, tipo) => {
    const pago = pagos.find(p => p.id === pagoId);
    if (!pago) return;
    setPagoParaMarcar(pago);
    setShowMarcarPagoModal(true);
  };

  const handleMarcarPago = async (datosPago) => {
    try {
      const { pagoId, montoAbonado, tipoPago, comprobante } = datosPago;
      const pago = pagos.find(p => p.id === pagoId);
      
      if (!pago) {
        showError('Pago no encontrado');
        return;
      }

      const montoTotal = pago.metodoPago === 'efectivo' ? pago.gananciaProfesional : pago.gananciaClinica;
      
      if (montoAbonado >= montoTotal) {
        const nuevoEstado = pago.metodoPago === 'efectivo' ? 'pagado' : 'completada';
        await markPagoAsCompleted(pagoId, nuevoEstado, comprobante, null);
        showSuccess('Pago marcado como completado');
      } else {
        const pagoParcial = {
          ...pago,
          monto: montoAbonado,
          gananciaProfesional: pago.metodoPago === 'efectivo' ? montoAbonado : pago.gananciaProfesional,
          gananciaClinica: pago.metodoPago === 'transferencia' ? montoAbonado : pago.gananciaClinica,
          comprobante: comprobante,
          esPagoParcial: true,
          pagoOriginalId: pagoId
        };
        
        await addPago(pagoParcial);
        showSuccess('Pago parcial registrado');
      }
      
      setShowMarcarPagoModal(false);
      setPagoParaMarcar(null);
    } catch (error) {
      console.error('Error al marcar pago:', error);
      showError('Error al procesar el pago');
    }
  };

  const marcarEfectivoPagado = (profesionalId) => {
    const pagosAfectados = pagos.filter(p => 
      p.profesionalId === profesionalId && 
      p.metodoPago === 'efectivo' && 
      p.estado === 'pendiente'
    );
    
    setPagos(pagos.map(pago => 
      pago.profesionalId === profesionalId && 
      pago.metodoPago === 'efectivo' && 
      pago.estado === 'pendiente'
        ? {...pago, estado: 'pagado', fechaPago: new Date().toISOString()}
        : pago
    ));
    
    addLog('pagos_masivos', `Marcados ${pagosAfectados.length} pagos en efectivo como pagados para profesional`, {
      profesionalId,
      cantidadPagos: pagosAfectados.length,
      montoTotal: pagosAfectados.reduce((sum, p) => sum + p.gananciaProfesional, 0)
    });
  };

  const marcarTransferenciasCobradas = (profesionalId) => {
    const pagosAfectados = pagos.filter(p => 
      p.profesionalId === profesionalId && 
      p.metodoPago === 'transferencia' && 
      p.estado === 'recibida'
    );
    
    const sinComprobante = pagosAfectados.some(p => !p.comprobante);
    
    // Mostrar modal para comprobantes
    setComprobanteData({
      profesionalId,
      pagosAfectados,
      sinComprobante
    });
    setShowComprobanteModal(true);
  };

  const handleComprobanteConfirm = ({ comprobanteProfesional, comprobanteClinica }) => {
    const { profesionalId, pagosAfectados } = comprobanteData;
    
    setPagos(pagos.map(pago => 
      pago.profesionalId === profesionalId && 
      pago.metodoPago === 'transferencia' && 
      pago.estado === 'recibida'
        ? {
            ...pago, 
            estado: 'completada', 
            fechaPago: new Date().toISOString(), 
            comprobante: pago.comprobante || comprobanteProfesional,
            comprobanteClinica: comprobanteClinica || null
          }
        : pago
    ));
    
    addLog('comisiones_cobradas', `Marcadas ${pagosAfectados.length} comisiones de transferencia como cobradas para profesional`, {
      profesionalId,
      cantidadPagos: pagosAfectados.length,
      montoTotal: pagosAfectados.reduce((sum, p) => sum + p.gananciaClinica, 0),
      tieneComprobanteProfesional: !!comprobanteProfesional,
      tieneComprobanteClinica: !!comprobanteClinica
    });
    
    setShowComprobanteModal(false);
    setComprobanteData(null);
    showSuccess('Comisiones marcadas como cobradas');
  };

  const handleComprobanteCancel = () => {
    setShowComprobanteModal(false);
    setComprobanteData(null);
  };

  const aplicarFiltros = (pagosList) => {
    return pagosList.filter(pago => {
      let cumpleFiltros = true;
      
      if (filtros.profesional && pago.profesionalId !== parseInt(filtros.profesional)) {
        cumpleFiltros = false;
      }
      
      if (filtros.metodoPago && pago.metodoPago !== filtros.metodoPago) {
        cumpleFiltros = false;
      }
      
      if (filtros.fechaDesde && pago.fecha < filtros.fechaDesde) {
        cumpleFiltros = false;
      }
      
      if (filtros.fechaHasta && pago.fecha > filtros.fechaHasta) {
        cumpleFiltros = false;
      }
      
      return cumpleFiltros;
    });
  };

  const aplicarFiltrosReportes = (pagosList) => {
    return pagosList.filter(pago => {
      let cumpleFiltros = true;
      
      if (filtrosReportes.profesional && pago.profesionalId !== parseInt(filtrosReportes.profesional)) {
        cumpleFiltros = false;
      }
      
      if (filtrosReportes.fechaDesde && pago.fecha < filtrosReportes.fechaDesde) {
        cumpleFiltros = false;
      }
      
      if (filtrosReportes.fechaHasta && pago.fecha > filtrosReportes.fechaHasta) {
        cumpleFiltros = false;
      }
      
      return cumpleFiltros;
    });
  };

  const calcularReportes = () => {
    const pagosFiltrados = aplicarFiltrosReportes(pagos);
    
    const totalEfectivo = pagosFiltrados.filter(p => p.metodoPago === 'efectivo').reduce((sum, p) => sum + p.monto, 0);
    const totalTransferencias = pagosFiltrados.filter(p => p.metodoPago === 'transferencia').reduce((sum, p) => sum + p.monto, 0);
    const totalGeneral = totalEfectivo + totalTransferencias;
    
    const totalGananciasProfesionales = pagosFiltrados.reduce((sum, p) => sum + p.gananciaProfesional, 0);
    const totalGananciasClinica = pagosFiltrados.reduce((sum, p) => sum + p.gananciaClinica, 0);
    
    const reportePorProfesional = profesionales.map(prof => {
      const pagosProf = pagosFiltrados.filter(p => p.profesionalId === prof.id);
      const efectivos = pagosProf.filter(p => p.metodoPago === 'efectivo');
      const transferencias = pagosProf.filter(p => p.metodoPago === 'transferencia');
      
      return {
        id: prof.id,
        nombre: prof.nombre,
        especialidad: prof.especialidad,
        cantidadConsultas: pagosProf.length,
        totalFacturado: pagosProf.reduce((sum, p) => sum + p.monto, 0),
        gananciaProfesional: pagosProf.reduce((sum, p) => sum + p.gananciaProfesional, 0),
        gananciaClinica: pagosProf.reduce((sum, p) => sum + p.gananciaClinica, 0),
        efectivos: {
          cantidad: efectivos.length,
          monto: efectivos.reduce((sum, p) => sum + p.monto, 0)
        },
        transferencias: {
          cantidad: transferencias.length,
          monto: transferencias.reduce((sum, p) => sum + p.monto, 0)
        }
      };
    }).filter(r => r.cantidadConsultas > 0);
    
    return {
      totalEfectivo,
      totalTransferencias,
      totalGeneral,
      totalGananciasProfesionales,
      totalGananciasClinica,
      cantidadConsultas: pagosFiltrados.length,
      reportePorProfesional,
      pagosFiltrados
    };
  };

  const calcularDetallesProfesionalOptimizado = (profesionalId) => {
    return calcularDetallesProfesional(profesionalId);
  };

  const handleExportReporte = (opciones) => {
    exportarReporteCSV(opciones);
    setShowExportModal(false);
  };

  const exportarReporteCSV = (opciones = {}) => {
    const reportes = calcularReportes();
    const {
      formato = 'csv',
      secciones = { resumen: true, profesionales: true, pagos: true, estadisticas: true },
      filtros = { incluirComprobantes: true, incluirGanancias: true, incluirEstados: true, soloCompletados: false }
    } = opciones;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (secciones.resumen) {
      csvContent += "RESUMEN GENERAL\n";
      csvContent += "Concepto,Monto,Cantidad\n";
      csvContent += `Total Facturado,${(reportes.totalGeneral || 0).toLocaleString()},${reportes.cantidadConsultas} consultas\n`;
      csvContent += `Ganancias Profesionales,${(reportes.totalGananciasProfesionales || 0).toLocaleString()},-\n`;
      csvContent += `Ganancias Clínica,${(reportes.totalGananciasClinica || 0).toLocaleString()},-\n`;
      csvContent += `Efectivo,${(reportes.totalEfectivo || 0).toLocaleString()},-\n`;
      csvContent += `Transferencias,${(reportes.totalTransferencias || 0).toLocaleString()},-\n`;
      csvContent += "\n";
    }
    
    if (secciones.profesionales) {
      csvContent += "REPORTE POR PROFESIONAL\n";
      let header = "Nombre,Especialidad,Consultas,Total Facturado";
      if (filtros.incluirGanancias) header += ",Ganancia Profesional,Ganancia Clínica";
      header += ",Efectivos Cant,Efectivos Monto,Transferencias Cant,Transferencias Monto\n";
      csvContent += header;
      
      reportes.reportePorProfesional.forEach(prof => {
        let row = `"${prof.nombre}","${prof.especialidad}",${prof.cantidadConsultas},${prof.totalFacturado}`;
        if (filtros.incluirGanancias) row += `,${prof.gananciaProfesional},${prof.gananciaClinica}`;
        row += `,${prof.efectivos.cantidad},${prof.efectivos.monto},${prof.transferencias.cantidad},${prof.transferencias.monto}\n`;
        csvContent += row;
      });
      csvContent += "\n";
    }
    
    if (secciones.pagos) {
      csvContent += "DETALLE DE PAGOS\n";
      let header = "Fecha,Hora,Profesional,Paciente,Método Pago,Monto";
      if (filtros.incluirGanancias) header += ",Ganancia Profesional,Ganancia Clínica";
      if (filtros.incluirEstados) header += ",Estado";
      if (filtros.incluirComprobantes) header += ",Comprobante";
      header += "\n";
      csvContent += header;
      
      let pagosFiltrados = reportes.pagosFiltrados;
      if (filtros.soloCompletados) {
        pagosFiltrados = pagosFiltrados.filter(p => p.estado === 'pagado' || p.estado === 'completada');
      }
      
      pagosFiltrados.forEach(pago => {
        let row = `${pago.fecha},${pago.hora},"${pago.profesionalNombre}","${pago.paciente}",${pago.metodoPago},${pago.monto}`;
        if (filtros.incluirGanancias) row += `,${pago.gananciaProfesional},${pago.gananciaClinica}`;
        if (filtros.incluirEstados) row += `,${pago.estado}`;
        if (filtros.incluirComprobantes) row += `,"${pago.comprobante || ''}"`;
        row += "\n";
        csvContent += row;
      });
      csvContent += "\n";
    }
    
    if (secciones.estadisticas) {
      csvContent += "ESTADÍSTICAS AVANZADAS\n";
      csvContent += "Métrica,Valor\n";
      csvContent += `Promedio por Consulta,${reportes.cantidadConsultas > 0 ? Math.round(reportes.totalGeneral / reportes.cantidadConsultas) : 0}\n`;
      csvContent += `Porcentaje Efectivo,${Math.round((reportes.totalEfectivo / reportes.totalGeneral) * 100) || 0}%\n`;
      csvContent += `Porcentaje Transferencias,${Math.round((reportes.totalTransferencias / reportes.totalGeneral) * 100) || 0}%\n`;
      csvContent += `Ratio Ganancia Clínica,${Math.round((reportes.totalGananciasClinica / reportes.totalGeneral) * 100) || 0}%\n`;
      csvContent += "\n";
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    const fechaActual = new Date().toISOString().split('T')[0];
    const filtroTexto = filtrosReportes.profesional ? 
      `_${profesionales.find(p => p.id === parseInt(filtrosReportes.profesional))?.nombre.replace(/\s+/g, '_')}` : '';
    const rangoFecha = filtrosReportes.fechaDesde && filtrosReportes.fechaHasta ? 
      `_${filtrosReportes.fechaDesde}_a_${filtrosReportes.fechaHasta}` : '';
    
    const extension = formato === 'xlsx' ? 'xlsx' : 'csv';
    link.setAttribute("download", `reporte_medpay_${fechaActual}${filtroTexto}${rangoFecha}.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addLog('reporte_exportado', `Reporte exportado a ${formato.toUpperCase()}`, {
      totalRegistros: reportes.pagosFiltrados.length,
      profesionales: reportes.reportePorProfesional.length,
      montoTotal: reportes.totalGeneral,
      filtros: filtrosReportes,
      opciones: opciones
    });
    
    showSuccess(`Reporte exportado con éxito (${formato.toUpperCase()})`);
  };

  const getEstadoColor = (pago) => {
    if (pago.metodoPago === 'efectivo') {
      return pago.estado === 'pendiente' ? 'bg-orange-500' : 'bg-green-500';
    } else {
      return pago.estado === 'recibida' ? 'bg-blue-500' : 'bg-green-500';
    }
  };

  const getEstadoTexto = (pago) => {
    if (pago.metodoPago === 'efectivo') {
      return pago.estado === 'pendiente' ? 'Debe pagar clínica' : 'Pagado';
    } else {
      return pago.estado === 'recibida' ? 'Comisión pendiente' : 'Completado';
    }
  };

  // Renderizar el contenido
  return renderContent();
};

export default ConsultorioPagosApp;
                    
