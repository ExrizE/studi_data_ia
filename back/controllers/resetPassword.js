const crypto = require('crypto');
const db = require('../db');
const nodemailer = require('nodemailer');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Trouver l'utilisateur avec l'email donné
  const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', email);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Générer un token unique
  const token = crypto.randomBytes(32).toString('hex');

  // Sauvegarder le token et la date d'expiration dans la base de données
  await db.none('INSERT INTO password_reset (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'1 hour\')', [user.id, token]);

  // Envoyer le lien de réinitialisation de mot de passe par email
  const transporter = nodemailer.createTransport({
    service: 'gmail', // use your email service provider
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
  });

  const mailOptions = {
    from: 'no-reply@datapro.com',
    to: user.email,
    subject: 'Réinitialisation du mot de passe',
    text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${process.env.FRONTEND_URL}/resetpassword/${token}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Error sending email" });
    } else {
      return res.status(200).json({ message: "Password reset link sent" });
    }
  });
};