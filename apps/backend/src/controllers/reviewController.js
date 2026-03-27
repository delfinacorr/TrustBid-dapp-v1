import { Review, Project, User } from '../models/index.js';

// GET /api/projects/:projectId/reviews
export const getReviewsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const reviews = await Review.findAll({
      where: { project_id: projectId },
      include: [{ model: User, as: 'auditor', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reviews' });
  }
};

// POST /api/projects/:projectId/reviews
export const createReview = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { score, comment } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    const review = await Review.create({
      project_id: projectId,
      auditor_id: req.user.id, // Solo un auditor autenticado llega aquí
      score,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la review' });
  }
};

// PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const { score, comment } = req.body;
    const review = await Review.findByPk(req.params.id);

    if (!review) return res.status(404).json({ error: 'Review no encontrada' });

    // Validar que solo el dueño de la review o el admin la puedan editar
    if (req.user.role !== 'admin' && review.auditor_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permisos para editar esta review' });
    }

    await review.update({ score, comment });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la review' });
  }
};
