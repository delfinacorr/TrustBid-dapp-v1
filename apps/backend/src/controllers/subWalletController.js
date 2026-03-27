import { SubWallet, Project, Transaction } from '../models/index.js';

// GET /api/projects/:projectId/subwallets
export const getSubWalletsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const subwallets = await SubWallet.findAll({
      where: { project_id: projectId },
      include: [{ model: Transaction, as: 'transactions' }]
    });
    res.json(subwallets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener subwallets' });
  }
};

// POST /api/projects/:projectId/subwallets
export const createSubWallet = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { area_label, budget_ceiling } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    // Permisos: Admin o el PM del proyecto
    if (req.user.role !== 'admin' && project.pm_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permisos para crear subwallets en este proyecto' });
    }

    const subwallet = await SubWallet.create({
      project_id: projectId,
      area_label,
      budget_ceiling: budget_ceiling || 0,
      current_balance: 0
    });

    res.status(201).json(subwallet);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear subwallet' });
  }
};

// PUT /api/subwallets/:id
export const updateSubWallet = async (req, res) => {
  try {
    const { area_label, budget_ceiling } = req.body;
    const subwallet = await SubWallet.findByPk(req.params.id, {
      include: [{ model: Project, as: 'project' }]
    });

    if (!subwallet) return res.status(404).json({ error: 'SubWallet no encontrado' });

    const project = subwallet.project;
    if (req.user.role !== 'admin' && project?.pm_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permisos para editar este subwallet' });
    }

    await subwallet.update({ area_label, budget_ceiling });
    res.json(subwallet);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar subwallet' });
  }
};

// DELETE /api/subwallets/:id
export const deleteSubWallet = async (req, res) => {
  try {
    const subwallet = await SubWallet.findByPk(req.params.id);
    if (!subwallet) return res.status(404).json({ error: 'SubWallet no encontrado' });

    // En un caso real solo Admin debería borrar para evitar inconsistencias financieras
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Solo los administradores pueden eliminar subwallets' });
    }

    await subwallet.destroy();
    res.json({ message: 'SubWallet eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar subwallet' });
  }
};
