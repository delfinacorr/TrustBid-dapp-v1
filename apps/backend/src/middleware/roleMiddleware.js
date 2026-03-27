/**
 * Middleware para validar que el usuario tenga uno de los roles permitidos.
 * @param {Array<string>} roles - Array de roles permitidos (ej: ['admin', 'pm'])
 */
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Usuario no autenticado o no tiene rol asignado.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso prohibido: Rol insuficiente para realizar esta acción.' });
    }

    next();
  };
};

export default roleMiddleware;
