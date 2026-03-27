import { Project, User, SubWallet } from '../models/index.js';

// GET /api/projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: User, as: 'manager', attributes: ['id', 'name', 'email'] }
      ]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
};

// GET /api/projects/:id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'manager', attributes: ['id', 'name', 'email'] },
        { model: SubWallet, as: 'sub_wallets' }
      ]
    });
    
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyecto' });
  }
};

// POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { name, description, status, total_allocation, pm_id } = req.body;
    
    // Si no se envía pm_id y el creador es PM, asignarlo a sí mismo
    const managerId = pm_id || (req.user.role === 'pm' ? req.user.id : null);

    const project = await Project.create({
      name,
      description,
      status: status || 'pending',
      total_allocation: total_allocation || 0,
      pm_id: managerId
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const { name, description, status, total_allocation, pm_id } = req.body;
    const project = await Project.findByPk(req.params.id);
    
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    // Validar permisos (solo Admin, o el PM dueño del proyecto)
    if (req.user.role !== 'admin' && project.pm_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este proyecto' });
    }

    await project.update({ name, description, status, total_allocation, pm_id });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    await project.destroy();
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
};
