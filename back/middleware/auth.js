const jwt = require('jsonwebtoken');
const db = require('../db/db');

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
}

const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  const expiry_date = new Date();
  expiry_date.setDate(expiry_date.getDate() + 7); // Set the expiry date 7 days into the future.

  // Store the refresh token in the database
  await db.query('INSERT INTO refresh_tokens(token, user_id, expiry_date) VALUES($1, $2, $3)', [refreshToken, user.id, expiry_date]);

  return refreshToken;
};

const auth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      const refreshToken = req.headers['refresh-token'];

      if (refreshToken == null) return res.sendStatus(401);

      // Get the refresh token from the database.
      const dbToken = await db.query('SELECT * FROM refresh_tokens WHERE user_id = $1', [user.id]);

      if (!dbToken.rows[0] || Date.now() > dbToken.rows[0].expiry_date) {
        return res.sendStatus(403);
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);

        // Create a new access and refresh token.
        const accessToken = generateAccessToken(user);
        const newRefreshToken = await generateRefreshToken(user);
        
        // Delete the old refresh token from the database.
        await db.query('DELETE FROM refresh_tokens WHERE token = $1', [dbToken.rows[0].token]);

        // Set the new access and refresh tokens in the response.
        req.user = user;
        res.json({ accessToken: accessToken, refreshToken: newRefreshToken });
      });
    } else {
      req.user = user;
      next();
    }
  });
};

const authenticateRefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (refreshToken == null) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
      const { role } = user;
      if (role !== 'admin') {
        return res.status(403).json({ message: 'This route requires admin access.' });
      }

      next();
  });
};

module.exports = { auth , authenticateRefreshToken, requireAdmin, generateAccessToken, generateRefreshToken };