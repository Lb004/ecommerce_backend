export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "No autenticado. Debes iniciar sesión."
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "No tienes permisos para realizar esta acción.",
        requiredRoles: roles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "No autenticado. Debes iniciar sesión."
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Solo los administradores pueden realizar esta acción."
    });
  }

  next();
};

export const isUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "No autenticado. Debes iniciar sesión."
    });
  }

  if (req.user.role !== "user") {
    return res.status(403).json({
      error: "Solo los usuarios pueden realizar esta acción."
    });
  }

  next();
};