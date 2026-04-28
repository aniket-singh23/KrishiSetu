const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ===== RATE LIMITING =====
const rateLimit = {};
function checkRateLimit(key, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    if (!rateLimit[key]) rateLimit[key] = [];
    rateLimit[key] = rateLimit[key].filter(t => now - t < windowMs);
    if (rateLimit[key].length >= maxRequests) return false;
    rateLimit[key].push(now);
    return true;
}

// ===== INPUT SANITIZATION =====
function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>\"'&]/g, char => {
        const map = { '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#x27;', '&': '&amp;' };
        return map[char];
    });
}

const app = express();
const port = Number(process.env.PORT || 3001);
const jwtSecret = process.env.JWT_SECRET || 'dev-only-change-this-secret';
const usersFilePath = path.join(__dirname, 'data', 'users.json');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

async function ensureUsersFile() {
    const dirPath = path.dirname(usersFilePath);
    await fs.mkdir(dirPath, { recursive: true });

    try {
        await fs.access(usersFilePath);
    } catch {
        await fs.writeFile(usersFilePath, '[]\n', 'utf-8');
    }
}

async function readUsers() {
    await ensureUsersFile();
    const fileContents = await fs.readFile(usersFilePath, 'utf-8');

    try {
        const parsed = JSON.parse(fileContents);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function writeUsers(users) {
    await fs.writeFile(usersFilePath, `${JSON.stringify(users, null, 2)}\n`, 'utf-8');
}

function normalize(value) {
    return String(value || '').trim();
}

function normalizeEmail(email) {
    return normalize(email).toLowerCase();
}

function normalizePhone(phone) {
    return normalize(phone).replace(/[\s\-()]/g, '');
}

function sanitizeUser(user) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
}

function issueToken({ userId, role, remember }) {
    const expiresIn = remember ? '30d' : '12h';
    return jwt.sign({ sub: userId, role }, jwtSecret, { expiresIn });
}

function extractBearerToken(authHeader) {
    const value = normalize(authHeader);
    if (!value.toLowerCase().startsWith('bearer ')) {
        return null;
    }

    return normalize(value.slice(7));
}

async function requireAuth(req, res, next) {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
        return res.status(401).json({ message: 'Missing authorization token' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.auth = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

function buildDefaultStats() {
    return {
        gamesPlayed: 0,
        totalScore: 0,
        winStreak: 0,
        gameAccuracy: 0,
        virtualFarmeryScore: 0,
        pickOddOutScore: 0,
        dailyQuestCompleted: 0
    };
}

function ensureUserStats(user) {
    if (!user.gameStats || typeof user.gameStats !== 'object') {
        user.gameStats = buildDefaultStats();
    }

    const defaults = buildDefaultStats();
    Object.keys(defaults).forEach((key) => {
        if (!Number.isFinite(user.gameStats[key])) {
            user.gameStats[key] = defaults[key];
        }
    });

    return user.gameStats;
}

function validateRegistrationInput(body) {
    const requiredFields = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'password',
        'farmSize',
        'farmingType',
        'country',
        'experienceLevel'
    ];

    for (const field of requiredFields) {
        if (!normalize(body[field])) {
            return `${field} is required`;
        }
    }

    if (normalize(body.password).length < 8) {
        return 'Password must be at least 8 characters';
    }

    return null;
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/auth/check-email', async (req, res) => {
    const email = normalizeEmail(req.query.email);

    if (!email) {
        return res.status(400).json({ available: false, message: 'Email is required' });
    }

    const users = await readUsers();
    const exists = users.some((user) => user.email === email);

    return res.json({ available: !exists });
});

app.post('/api/auth/register', async (req, res) => {
    // Rate limit registration attempts (5 per hour per IP)
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(`register:${clientIp}`, 5, 3600000)) {
        return res.status(429).json({ message: 'Too many registration attempts. Try again later.' });
    }

    try {
        const validationMessage = validateRegistrationInput(req.body || {});
        if (validationMessage) {
            return res.status(400).json({ message: validationMessage });
        }

        const users = await readUsers();
        const email = normalizeEmail(req.body.email);
        const phone = normalizePhone(req.body.phone);

        const existingUser = users.find((user) => user.email === email || user.phone === phone);
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email or phone already exists' });
        }

        const passwordHash = await bcrypt.hash(normalize(req.body.password), 12);
        const user = {
            id: crypto.randomUUID(),
            firstName: normalize(req.body.firstName),
            lastName: normalize(req.body.lastName),
            name: `${normalize(req.body.firstName)} ${normalize(req.body.lastName)}`.trim(),
            email,
            phone,
            dateOfBirth: normalize(req.body.dateOfBirth) || null,
            farmSize: normalize(req.body.farmSize),
            farmingType: normalize(req.body.farmingType),
            country: normalize(req.body.country),
            experienceLevel: normalize(req.body.experienceLevel),
            notifications: Array.isArray(req.body.notifications) ? req.body.notifications : [],
            level: 1,
            xp: 0,
            coins: 0,
            gameStats: buildDefaultStats(),
            role: 'user',
            createdAt: new Date().toISOString(),
            passwordHash
        };

        users.push(user);
        await writeUsers(users);

        const token = issueToken({ userId: user.id, role: user.role, remember: true });
        return res.status(201).json({
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to register right now' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    // Rate limit login attempts (10 per minute per IP)
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(`login:${clientIp}`, 10, 60000)) {
        return res.status(429).json({ message: 'Too many login attempts. Try again in 1 minute.' });
    }

    try {
        const identifier = normalize(req.body.identifier);
        const password = normalize(req.body.password);
        const remember = Boolean(req.body.remember);

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Identifier and password are required' });
        }

        const users = await readUsers();
        const normalizedIdentifier = identifier.toLowerCase();
        const normalizedPhone = normalizePhone(identifier);

        const user = users.find((candidate) => {
            return candidate.email === normalizedIdentifier || candidate.phone === normalizedPhone;
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email/phone or password' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid email/phone or password' });
        }

        const token = issueToken({ userId: user.id, role: user.role, remember });
        return res.json({
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        return res.status(500).json({ message: 'Unable to login right now' });
    }
});

app.post('/api/auth/admin/login', async (req, res) => {
    const configuredAdminId = normalize(process.env.ADMIN_ID);
    const configuredAdminPasswordHash = normalize(process.env.ADMIN_PASSWORD_HASH);

    if (!configuredAdminId || !configuredAdminPasswordHash) {
        return res.status(503).json({
            message: 'Admin login is not configured on the server. Set ADMIN_ID and ADMIN_PASSWORD_HASH.'
        });
    }

    const adminId = normalize(req.body.adminId);
    const password = normalize(req.body.password);
    const secureSession = Boolean(req.body.secureSession);

    if (!adminId || !password) {
        return res.status(400).json({ message: 'Admin ID and password are required' });
    }

    if (adminId !== configuredAdminId) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isValid = await bcrypt.compare(password, configuredAdminPasswordHash);
    if (!isValid) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = issueToken({ userId: `admin:${configuredAdminId}`, role: 'admin', remember: secureSession });

    return res.json({
        token,
        user: {
            id: `admin:${configuredAdminId}`,
            name: configuredAdminId,
            role: 'admin'
        }
    });
});

app.get('/api/me', requireAuth, async (req, res) => {
    if (String(req.auth.sub || '').startsWith('admin:')) {
        return res.json({
            user: {
                id: req.auth.sub,
                name: normalize(process.env.ADMIN_ID) || 'admin',
                role: 'admin'
            }
        });
    }

    const users = await readUsers();
    const user = users.find((candidate) => candidate.id === req.auth.sub);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    ensureUserStats(user);
    return res.json({ user: sanitizeUser(user) });
});

app.post('/api/stats/game', requireAuth, async (req, res) => {
    if (String(req.auth.sub || '').startsWith('admin:')) {
        return res.status(403).json({ message: 'Admin account cannot submit gameplay stats' });
    }

    // Validate and sanitize game stats input
    const game = sanitizeInput(normalize(req.body.game).toLowerCase());
    const score = Math.max(0, Math.min(Number(req.body.score || 0), 999999));
    const accuracy = Math.max(0, Math.min(Number(req.body.accuracy || 0), 100));
    const completed = Boolean(req.body.completed);
    const won = Boolean(req.body.won);

    if (!game || game.length === 0) {
        return res.status(400).json({ message: 'game is required' });
    }

    const users = await readUsers();
    const userIndex = users.findIndex((candidate) => candidate.id === req.auth.sub);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const user = users[userIndex];
    const stats = ensureUserStats(user);

    stats.gamesPlayed += 1;
    stats.totalScore += Math.max(0, score);

    if (accuracy > 0) {
        // Fixed: Correctly calculate running average based on previous game count
        const gamesBeforeThis = stats.gamesPlayed - 1;
        const totalAccuracy = (stats.gameAccuracy * Math.max(0, gamesBeforeThis)) + accuracy;
        stats.gameAccuracy = totalAccuracy / stats.gamesPlayed;
    }

    if (won) {
        stats.winStreak += 1;
    } else {
        stats.winStreak = 0;
    }

    if (game === 'virtual-farmery') {
        stats.virtualFarmeryScore = Math.max(stats.virtualFarmeryScore, score);
    } else if (game === 'pick-odd-out') {
        stats.pickOddOutScore = Math.max(stats.pickOddOutScore, score);
    } else if (game === 'daily-quest' && completed) {
        stats.dailyQuestCompleted += 1;
    }

    users[userIndex] = user;
    await writeUsers(users);

    return res.json({
        message: 'Game stats updated',
        gameStats: stats
    });
});

// ===== LOGOUT ENDPOINT =====
app.post('/api/auth/logout', requireAuth, (req, res) => {
    // Token invalidation is client-side; server acknowledges logout
    return res.json({ message: 'Logged out successfully' });
});

// ===== UPDATE USER PROFILE ENDPOINT =====
app.put('/api/user/profile', requireAuth, async (req, res) => {
    if (String(req.auth.sub || '').startsWith('admin:')) {
        return res.status(403).json({ message: 'Admin account cannot update profile' });
    }

    const allowedFields = ['farmSize', 'farmingType', 'experienceLevel', 'notifications'];
    const updates = {};
    for (const field of allowedFields) {
        if (field in req.body) {
            updates[field] = field === 'notifications' ? req.body[field] : sanitizeInput(String(req.body[field]).trim());
        }
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === req.auth.sub);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(users[userIndex], updates);
    await writeUsers(users);
    return res.json({ user: sanitizeUser(users[userIndex]) });
});

// ===== ADMIN STATS ENDPOINT =====
app.get('/api/admin/users', requireAuth, async (req, res) => {
    if (String(req.auth.sub || '').startsWith('admin:') !== true) {
        return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await readUsers();
    const stats = {
        totalUsers: users.length,
        users: users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            level: u.level,
            xp: u.xp,
            coins: u.coins,
            gameStats: u.gameStats,
            createdAt: u.createdAt
        }))
    };
    return res.json(stats);
});

// ===== ADMIN DELETE USER ENDPOINT =====
app.delete('/api/admin/users/:userId', requireAuth, async (req, res) => {
    if (String(req.auth.sub || '').startsWith('admin:') !== true) {
        return res.status(403).json({ message: 'Admin access required' });
    }

    const userId = sanitizeInput(req.params.userId);
    const users = await readUsers();
    const filtered = users.filter(u => u.id !== userId);
    if (filtered.length === users.length) {
        return res.status(404).json({ message: 'User not found' });
    }
    await writeUsers(filtered);
    return res.json({ message: 'User deleted' });
});

ensureUsersFile()
    .then(() => {
        app.listen(port, () => {
            console.log(`Auth server running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start auth server', error);
        process.exit(1);
    });
