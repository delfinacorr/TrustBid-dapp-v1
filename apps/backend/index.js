import 'dotenv/config';
import app from './src/app.js';
import { sequelize } from './src/models/index.js';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Sincronizar base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos PostgreSQL exitosa');
    
    // Sincronizar modelos (no destructivo)
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
