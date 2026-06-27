import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js';

export default function authRoutes(db) {
  const router = Router();

  // POST /api/auth/login
  router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah.' });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Username atau password salah.' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: config.jwtExpiry }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
      },
    });
  });

  // GET /api/auth/me — verify token and return user info
  router.get('/me', (req, res) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token tidak ditemukan.' });
    }

    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = db.prepare('SELECT id, username, display_name FROM users WHERE id = ?').get(decoded.userId);
      if (!user) {
        return res.status(401).json({ error: 'Pengguna tidak ditemukan.' });
      }
      res.json({
        user: {
          id: user.id,
          username: user.username,
          displayName: user.display_name,
        },
      });
    } catch {
      res.status(401).json({ error: 'Token tidak valid atau telah kadaluarsa.' });
    }
  });

  return router;
}
