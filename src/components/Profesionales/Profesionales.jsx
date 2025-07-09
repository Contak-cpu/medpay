import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProfesionalesList from './ProfesionalesList';
import AddProfesionalModal from './AddProfesionalModal';
import EditProfesionalModal from './EditProfesionalModal';
import ProfesionalDetail from './ProfesionalDetail';

// Funciones de validación específicas
const validarNombre = (value) => {
  if (!value.trim()) return 'El nombre es obligatorio';
  if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
  return '';
};

const validarEspecialidad = (value) => {
  if (!value.trim()) return 'La especialidad es obligatoria';
  if (value.trim().length < 2) return 'La especialidad debe tener al menos 2 caracteres';
  return '';
};

const validarPorcentaje = (value) => {
  if (!value) return 'El porcentaje es obligatorio';
  const num = parseFloat(value);
  if (isNaN(num)) return 'El porcentaje debe ser un número válido';
  if (num < 0 || num > 100) return 'El porcentaje debe estar entre 0 y 100';
  return '';
};

const validarValorTurno = (value) => {
  if (!value) return 'El valor del turno es obligatorio';
  const num = parseFloat(value);
  if (isNaN(num)) return 'El valor del turno debe ser un número válido';
  if (num <= 0) return 'El valor del turno debe ser mayor a 0';
  return '';
};

const Profesionales = ({ 
  profesionales,
  showAddProfesional,
  setShowAddProfesional,
  newProfesional,
  erroresProfesional,
  setNewProfesional,
  setErroresProfesional,
  handleAddProfesional,
  isSubmittingProfesional,
  profesionalDetallado,
  setProfesionalDetallado,
  deleteProfesional,
  refreshData,
  showSuccessNotification,
  validarProfesionalCompleto,
  calcularDetallesProfesional,
  updateProfesional
}) => {
  // Estado para edición
  const [showEditProfesional, setShowEditProfesional] = useState(false);
  const [profesionalEditando, setProfesionalEditando] = useState(null);
  const [editValues, setEditValues] = useState({
    nombre: '',
    especialidad: '',
    porcentaje: '',
    valorTurno: ''
  });
  const [editErrores, setEditErrores] = useState({
    nombre: '',
    especialidad: '',
    porcentaje: '',
    valorTurno: ''
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Función para abrir modal de edición
  const handleEditProfesional = (profesional) => {
    setProfesionalEditando(profesional);
    setEditValues({
      nombre: profesional.nombre,
      especialidad: profesional.especialidad,
      porcentaje: profesional.porcentaje.toString(),
      valorTurno: profesional.valor_turno.toString()
    });
    setEditErrores({
      nombre: '',
      especialidad: '',
      porcentaje: '',
      valorTurno: ''
    });
    setShowEditProfesional(true);
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditChange = (field, value) => {
    setEditValues({ ...editValues, [field]: value });
    
    // Usar funciones de validación específicas en lugar de eval
    let error = '';
    switch (field) {
      case 'nombre':
        error = validarNombre(value);
        break;
      case 'especialidad':
        error = validarEspecialidad(value);
        break;
      case 'porcentaje':
        error = validarPorcentaje(value);
        break;
      case 'valorTurno':
        error = validarValorTurno(value);
        break;
      default:
        error = '';
    }
    
    setEditErrores({ ...editErrores, [field]: error });
  };

  // Función para guardar cambios
  const handleSaveEdit = async () => {
    if (validarProfesionalCompleto()) {
      setIsSubmittingEdit(true);
      try {
        const profesionalData = {
          id: profesionalEditando.id,
          nombre: editValues.nombre.trim(),
          especialidad: editValues.especialidad.trim(),
          porcentaje: parseFloat(editValues.porcentaje),
          valor_turno: parseFloat(editValues.valorTurno)
        };
        
        await updateProfesional(profesionalData);
        await refreshData();
        
        // Limpiar formulario y cerrar modal
        setEditValues({ nombre: '', especialidad: '', porcentaje: '', valorTurno: '' });
        setEditErrores({ nombre: '', especialidad: '', porcentaje: '', valorTurno: '' });
        setShowEditProfesional(false);
        setProfesionalEditando(null);
        
        showSuccessNotification('Profesional actualizado con éxito');
      } catch (error) {
        console.error('Error updating profesional:', error);
        showSuccessNotification('Error al actualizar profesional: ' + (error.message || 'Error desconocido'));
      } finally {
        setIsSubmittingEdit(false);
      }
    }
  };

  // Función para manejar ver detalle
  const handleVerDetalle = (profesional) => {
    setProfesionalDetallado(profesional);
  };

  // Función para manejar cambios en el formulario de agregar
  const handleAddChange = (field, value) => {
    setNewProfesional({ ...newProfesional, [field]: value });
    
    // Usar funciones de validación específicas en lugar de eval
    let error = '';
    switch (field) {
      case 'nombre':
        error = validarNombre(value);
        break;
      case 'especialidad':
        error = validarEspecialidad(value);
        break;
      case 'porcentaje':
        error = validarPorcentaje(value);
        break;
      case 'valorTurno':
        error = validarValorTurno(value);
        break;
      default:
        error = '';
    }
    
    setErroresProfesional({ ...erroresProfesional, [field]: error });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Gestión de Profesionales
        </h2>
        <button
          onClick={() => setShowAddProfesional(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] flex items-center space-x-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Agregar Profesional</span>
        </button>
      </div>
      
      <ProfesionalesList
        profesionales={profesionales}
        onSelect={handleVerDetalle}
        onEdit={handleEditProfesional}
        onDelete={async id => {
          if (window.confirm('¿Seguro que deseas eliminar este profesional?')) {
            await deleteProfesional(id);
            await refreshData();
            showSuccessNotification('Profesional eliminado');
          }
        }}
      />
      
      {/* Modal para agregar profesional */}
      {showAddProfesional && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <AddProfesionalModal
            values={newProfesional}
            errores={erroresProfesional}
            onChange={handleAddChange}
            onSubmit={handleAddProfesional}
            onCancel={() => setShowAddProfesional(false)}
            loading={isSubmittingProfesional}
          />
        </div>
      )}
      
      {/* Modal para editar profesional */}
      {showEditProfesional && profesionalEditando && (
        <EditProfesionalModal
          profesional={profesionalEditando}
          values={editValues}
          errores={editErrores}
          onChange={handleEditChange}
          onSubmit={handleSaveEdit}
          onCancel={() => {
            setShowEditProfesional(false);
            setProfesionalEditando(null);
            setEditValues({ nombre: '', especialidad: '', porcentaje: '', valorTurno: '' });
            setEditErrores({ nombre: '', especialidad: '', porcentaje: '', valorTurno: '' });
          }}
          loading={isSubmittingEdit}
        />
      )}
      
      {/* Modal para ver detalle del profesional */}
      {profesionalDetallado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <ProfesionalDetail
            profesional={profesionalDetallado}
            estadisticas={calcularDetallesProfesional(profesionalDetallado.id)?.estadisticas}
            onClose={() => setProfesionalDetallado(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Profesionales; 