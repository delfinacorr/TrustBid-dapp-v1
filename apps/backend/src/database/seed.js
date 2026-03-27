import 'dotenv/config';
import { sequelize, User, Project, SubWallet, Transaction, Review } from '../models/index.js';
import crypto from 'crypto';

const uuid = () => crypto.randomUUID();

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seeding de la base de datos...');
    
    // Conectar y forzar sincronización (destructivo)
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('✅ Base de datos recreada limpia');

    // 1. Crear Usuarios con UUID simulados de Neon Auth
    const admin = await User.create({
      id: uuid(),
      name: 'Admin Principal',
      email: 'admin@trustbid.com',
      role: 'admin',
      is_verified: true,
      wallet_address: '0x123...admin'
    });

    const pm = await User.create({
      id: uuid(),
      name: 'Project Manager 1',
      email: 'pm@trustbid.com',
      role: 'pm',
      is_verified: true,
      wallet_address: '0x456...pm'
    });

    const auditor = await User.create({
      id: uuid(),
      name: 'Auditor Experto',
      email: 'auditor@trustbid.com',
      role: 'auditor',
      is_verified: true,
      wallet_address: '0x789...auditor'
    });

    console.log('✅ Usuarios creados');

    // 2. Crear Proyecto
    const project = await Project.create({
      name: 'Construcción Escuela Piloto',
      description: 'Proyecto piloto para transparencia con blockchain',
      status: 'active',
      total_allocation: 100000,
      pm_id: pm.id
    });

    console.log('✅ Proyecto creado');

    // 3. Crear SubWallets
    const swMaterials = await SubWallet.create({
      project_id: project.id,
      area_label: 'Materiales',
      budget_ceiling: 60000,
      current_balance: 50000 // Simulando que se gastaron 10k
    });

    const swLabor = await SubWallet.create({
      project_id: project.id,
      area_label: 'Mano de Obra',
      budget_ceiling: 40000,
      current_balance: 40000
    });

    console.log('✅ SubWallets creadas');

    // 4. Crear Transacción
    await Transaction.create({
      sub_wallet_id: swMaterials.id,
      amount: 10000,
      concept: 'Compra inicial de cemento y varillas',
      recipient_hash: '0xabc...proveedor',
      tx_type: 'debit'
    });

    console.log('✅ Transacción registrada');

    // 5. Crear Review
    await Review.create({
      project_id: project.id,
      auditor_id: auditor.id,
      score: 9,
      comment: 'Los fondos iniciales cuadran perfectamente.'
    });

    console.log('✅ Review añadida');

    console.log('🎉 Seeding completado con éxito!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en el seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
