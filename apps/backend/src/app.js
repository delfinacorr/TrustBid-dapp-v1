import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Rutas
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import subWalletRoutes from './routes/subWallet.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import reviewRoutes from './routes/review.routes.js';

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Verificación de salud (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Rutas API
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subwallets', subWalletRoutes); // Incluye algunas de projectos internamente
app.use('/api/subwallets', transactionRoutes); 
app.use('/api/reviews', reviewRoutes); // Incluye algunas de projectos internamente

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
