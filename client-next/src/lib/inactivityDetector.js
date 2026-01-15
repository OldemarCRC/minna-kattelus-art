import axios from './axios';

let inactivityTimer;
let heartbeatInterval;
const minutes = 15;
const INACTIVITY_TIME = minutes * 60 * 1000; // 15 minutos
const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutos

const sendHeartbeat = async () => {
  try {
    await axios.post('/api/auth/heartbeat');
    console.log('💓 Heartbeat sent - lastActivity updated in DB');
  } catch (error) {
    console.error('Heartbeat error:', error);
  }
};

export const startInactivityDetector = (logoutCallback) => {
  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      console.log(`User inactive for ${minutes} min - logging out`);
      logoutCallback();
    }, INACTIVITY_TIME);
  };

  // Eventos que indican actividad del usuario
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  
  events.forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });

  resetTimer(); // Iniciar el timer de inactividad

  // Enviar heartbeat cada 5 minutos
  heartbeatInterval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
  
  console.log(`Inactivity detector started (${minutes} min) + Heartbeat (every 5 min)`);
};

export const stopInactivityDetector = () => {
  clearTimeout(inactivityTimer);
  clearInterval(heartbeatInterval);
  console.log('Inactivity detector stopped');
};