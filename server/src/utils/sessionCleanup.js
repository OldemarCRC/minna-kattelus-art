import User from '../models/User.js';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutos en milisegundos

export const cleanupInactiveSessions = async () => {
  try {
    const inactivityThreshold = new Date(Date.now() - INACTIVITY_TIMEOUT);

    // Primero encontrar los usuarios que serán cerrados (para logging)
    const inactiveUsers = await User.find({
      isOnline: true,
      lastActivity: { $lt: inactivityThreshold }
    }).select('username email lastActivity');

    if (inactiveUsers.length > 0) {
      console.log(`\n[SESSION CLEANUP] Encontradas ${inactiveUsers.length} sesiones inactivas:`);
      inactiveUsers.forEach(user => {
        const minutesInactive = Math.floor((Date.now() - user.lastActivity) / 60000);
        console.log(`  - ${user.username} (${user.email}) - Inactivo por ${minutesInactive} min`);
      });
    }

    // Cerrar sesiones
    const result = await User.updateMany(
      {
        isOnline: true,
        lastActivity: { $lt: inactivityThreshold }
      },
      {
        $set: {
          isOnline: false,
          sessionToken: null
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[SESSION CLEANUP] ✅ ${result.modifiedCount} sesiones cerradas exitosamente\n`);
    }
  } catch (error) {
    console.error('[SESSION CLEANUP] ❌ Error:', error);
  }
};