import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function initDatabase() {
  const db = new Database(config.dbPath);

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Run schema
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  db.exec(schema);

  // Seed default admin user if none exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    const hash = bcrypt.hashSync(config.adminPassword, 10);
    db.prepare('INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)').run(
      config.adminUsername,
      hash,
      'Administrator'
    );
    console.log(`Default admin user created: ${config.adminUsername}`);
  }

  // Seed sample category if none exist
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (catCount.count === 0) {
    db.prepare('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)').run(
      'Pendidikan',
      'pendidikan',
      'Artikel seputar dunia pendidikan'
    );
    db.prepare('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)').run(
      'Teknologi',
      'teknologi',
      'Tips dan trik teknologi'
    );
    db.prepare('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)').run(
      'Umum',
      'umum',
      'Artikel umum dan informasi'
    );
    console.log('Default categories created');
  }

  return db;
}
