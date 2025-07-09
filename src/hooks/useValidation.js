import { useState, useCallback } from 'react';

// Esquemas de validación
const validationSchemas = {
  profesional: {
    nombre: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      message: 'El nombre solo puede contener letras y espacios'
    },
    especialidad: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      message: 'La especialidad solo puede contener letras y espacios'
    },
    porcentaje: {
      required: true,
      type: 'number',
      min: 1,
      max: 100,
      message: 'El porcentaje debe ser un número entre 1 y 100'
    },
    valorTurno: {
      required: true,
      type: 'number',
      min: 0,
      message: 'El valor del turno debe ser un número mayor a 0'
    }
  },
  pago: {
    profesionalId: {
      required: true,
      message: 'El profesional es obligatorio'
    },
    paciente: {
      required: true,
      minLength: 2,
      message: 'El paciente es obligatorio'
    },
    monto: {
      required: true,
      type: 'number',
      min: 0,
      message: 'El monto debe ser un número mayor a 0'
    },
    fecha: {
      required: true,
      type: 'date',
      message: 'La fecha es obligatoria'
    },
    hora: {
      required: true,
      pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: 'Formato de hora inválido (HH:MM)'
    }
  }
};

const useValidation = (schemaName) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((field, value) => {
    const schema = validationSchemas[schemaName];
    if (!schema || !schema[field]) return '';

    const fieldSchema = schema[field];
    let error = '';

    // Validación requerida
    if (fieldSchema.required && (!value || value.toString().trim() === '')) {
      return fieldSchema.message || `${field} es obligatorio`;
    }

    if (value) {
      // Validación de longitud mínima
      if (fieldSchema.minLength && value.toString().length < fieldSchema.minLength) {
        return `${field} debe tener al menos ${fieldSchema.minLength} caracteres`;
      }

      // Validación de tipo número
      if (fieldSchema.type === 'number') {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          return `${field} debe ser un número válido`;
        }
        if (fieldSchema.min !== undefined && numValue < fieldSchema.min) {
          return `${field} debe ser mayor a ${fieldSchema.min}`;
        }
        if (fieldSchema.max !== undefined && numValue > fieldSchema.max) {
          return `${field} debe ser menor a ${fieldSchema.max}`;
        }
      }

      // Validación de patrón
      if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
        return fieldSchema.message || `${field} tiene un formato inválido`;
      }

      // Validación de fecha
      if (fieldSchema.type === 'date') {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return `${field} debe ser una fecha válida`;
        }
      }
    }

    return error;
  }, [schemaName]);

  const validateForm = useCallback((data) => {
    const schema = validationSchemas[schemaName];
    if (!schema) return { isValid: false, errors: {} };

    const newErrors = {};
    let hasErrors = false;

    Object.keys(schema).forEach(field => {
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setIsValid(!hasErrors);
    return { isValid: !hasErrors, errors: newErrors };
  }, [schemaName, validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(false);
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
    setIsValid(false);
  }, []);

  const clearFieldError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    isValid,
    validateField,
    validateForm,
    clearErrors,
    setFieldError,
    clearFieldError
  };
};

export default useValidation; 