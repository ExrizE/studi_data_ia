const db = require('../db/db');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth')
const saltRounds = 10;

const login = async (req, res) => {
    const { userName, password, deviceId } = req.body;

    // Check if email and password are provided
    if (!userName || !password || !deviceId) {
      return res.status(400).send({ error: 'Please provide usernme, password, and device id' });
    }

    try {
      // Fetch user from the database
      const user = await db.oneOrNone('SELECT * FROM users WHERE user_name = $1', [userName]);

      // If user not found, return error
      if (!user) {
        return res.status(400).send({ error: 'Invalid usernme or password' });
      }

      // Check if password matches
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).send({ error: 'Invalid usernme or password' });
      }

      // If user is not authorized, return error
      if (!user.is_authorized) {
        return res.status(401).send({ error: 'User not authorized yet. Please wait for the admin to validate your account.' });
      }

      // Delete existing refresh token for this device
      await db.query('DELETE FROM refresh_tokens WHERE user_id = $1 AND device_id = $2', [user.id, deviceId]);

      // Create tokens
      const accessToken = generateAccessToken({ id: user.id, role: user.role });
      const refreshToken = await generateRefreshToken({ id: user.id, role: user.role }, deviceId);

      // Send tokens in the response
      res.json({ accessToken, refreshToken });

    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal server error' });
    }
};

const register = async (req, res) => {
    const { email, password, passwordRepeat, firstName, lastName, userName } = req.body;
  
    if (!email || !password || !passwordRepeat || !firstName || !lastName || !userName) {
      return res.status(400).send({ error: 'Please provide all necessary fields' });
    }
  
    if (password !== passwordRepeat) {
      return res.status(400).send({ error: 'Passwords do not match' });
    }
  
    // Check if user already exists
    try {
      const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
  
      if (user) {
        return res.status(400).send({ error: 'User already exists' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal server error' });
    }
  
    // Hash password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
  
    // Create new user
    await db.one('INSERT INTO users (email, password, first_name, last_name, user_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_name, role', [email, hashedPassword, firstName, lastName, userName]);
    
    return res.status(201).json({ success: 'User registered successfully' });
};

const authorizeUser = async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can authorize users' });
    }
  
    const { userId } = req.params;
  
    await db.none('UPDATE users SET is_authorized = true WHERE id = $1', [userId]);
  
    return res.status(200).json({ success: 'User authorized successfully' });
};

const logout = async (req, res) => {
    try {
      // Supprimer le token de l'utilisateur de la base de données
      await db.query('DELETE FROM tokens WHERE token = $1', [req.token]);
  
      // Envoyer une réponse de succès
      res.status(200).send({ message: 'Déconnexion réussie.' });
    } catch (error) {
      res.status(500).send({ error: 'Erreur lors de la déconnexion.' });
    }
};

const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await db.any(`UPDATE users SET is_approved = true WHERE id = $1 RETURNING *`, [userId]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail', // use your email service provider
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // Email options
        let mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Account Approved',
            text: 'Your account has been approved by the admin.'
        };

        // Send email
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        
        return res.json({ message: 'User approved successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while approving the user.' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await db.any(`SELECT * FROM users`);
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while getting users.' });
    }
};
  
module.exports = { login, register, authorizeUser, logout, approveUser, getUsers };