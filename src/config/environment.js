// Configuración de entorno
export const ENV_CONFIG = {
  // Cambiar a false para desactivar datos de testeo
  ENABLE_TEST_DATA: false,
  
  // Entorno actual
  IS_DEVELOPMENT: import.meta.env.DEV,
  
  // Configuración de Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Configuración de la aplicación
  APP_NAME: 'MedPay AI',
  APP_VERSION: '1.0.0'
};

// Función para verificar si debemos usar datos de testeo
export const shouldUseTestData = () => {
  return ENV_CONFIG.ENABLE_TEST_DATA && ENV_CONFIG.IS_DEVELOPMENT;
};

// Función para mostrar información del entorno
export const getEnvironmentInfo = () => {
  return {
    environment: ENV_CONFIG.IS_DEVELOPMENT ? 'development' : 'production',
    testDataEnabled: shouldUseTestData(),
    appName: ENV_CONFIG.APP_NAME,
    version: ENV_CONFIG.APP_VERSION
  };
}; 