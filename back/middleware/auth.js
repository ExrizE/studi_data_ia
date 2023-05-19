const jwt = require('jsonwebtoken');
const db = require('../db/db');

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
}

const generateRefreshToken = async (user, deviceId) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  const expiry_date = new Date();
  expiry_date.setDate(expiry_date.getDate() + 7); // Set the expiry date 7 days into the future.

  // Store the refresh token in the database
  await db.query('INSERT INTO refresh_tokens(token, user_id, expiry_date, device_id) VALUES($1, $2, $3, $4)', [refreshToken, user.id, expiry_date, deviceId]);

  return refreshToken;
};

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Fetch user from the database
    const user = await db.one('SELECT * FROM users WHERE id = $1', [decoded.id]);
    
    // If user is not approved yet
    if (user.is_approved === false) {
      return res.status(403).json({ error: 'Your account has not been approved by an administrator yet.' });
    }  

    // If user not found or not authorized, throw an error
    if (!user || !user.is_authorized) {
      return res.status(403).send({ error: 'User is not authorized to access this resource' });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      const refreshToken = req.body.token;
      const deviceId = req.body.deviceId;

      if (refreshToken == null || deviceId == null) return res.sendStatus(401);

      // Get the refresh token from the database.
      const dbToken = await db.query('SELECT * FROM refresh_tokens WHERE device_id = $1 AND user_id = $2', [deviceId, user.id]);

      if (!dbToken.rows[0] || Date.now() > dbToken.rows[0].expiry_date || !await bcrypt.compare(refreshToken, dbToken.rows[0].token)) {
        return res.sendStatus(403);
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);

        // Create a new access and refresh token.
        const accessToken = generateAccessToken(user);
        const newRefreshToken = await generateRefreshToken(user, deviceId);
        
        // Delete the old refresh token from the database.
        await db.query('DELETE FROM refresh_tokens WHERE token = $1 AND device_id = $2', [dbToken.rows[0].token, deviceId]);

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

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    db.query('SELECT role FROM users WHERE id = $1', [user.id], (err, result) => {
      if (err || !result.rows.length) {
        return res.sendStatus(403);
      }

      const { role } = result.rows[0];

      if (role !== 'admin') {
        return res.status(403).json({ message: 'This route requires admin access.' });
      }

      next();
    });
  });
};

module.exports = { auth , authenticateToken, requireAdmin, generateAccessToken, generateRefreshToken };