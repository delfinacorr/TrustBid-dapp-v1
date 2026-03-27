import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: process.env.NEON_AUTH_JWKS_URL
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      callback(err, null);
    } else {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    }
  });
}

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No hay token proporcionado.' });
  }

  // Neon Auth envía JWTs asimétricos firmados con RS256
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido o expirado.', details: err.message });
    }
    req.user = decoded; // { sub, email, role, etc } Note: sub is the user ID in JWT standard
    
    // Mapear "sub" a "id" para mantener compatibilidad con nuestro código anterior
    if (req.user.sub && !req.user.id) {
      req.user.id = req.user.sub;
    }
    
    next();
  });
};

export default authMiddleware;
