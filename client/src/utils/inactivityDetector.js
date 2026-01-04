let inactivityTimer;
const INACTIVITY_TIME = 15 * 60 * 1000;

export const startInactivityDetector = (logoutCallback) => {
  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      console.log('Usuario inactivo por 15 minutos - cerrando sesión');
      logoutCallback();
    }, INACTIVITY_TIME);
  };

  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  
  events.forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });

  resetTimer();
  console.log('Detector de inactividad iniciado (15 min)');
};

export const stopInactivityDetector = () => {
  clearTimeout(inactivityTimer);
  console.log('Detector de inactividad detenido');
};