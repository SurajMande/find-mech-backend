const { getCollection, getCluster } = require('../config/db');
const { createUser, comparePassword } = require('../models/User');
const { createMechanic } = require('../models/Mechanic');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');

// ========== USER ==========

const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
      const cluster = getCluster();
      const query = `SELECT META().id FROM \`${process.env.COUCHBASE_BUCKET}\` WHERE type = 'user' AND email = $email LIMIT 1`;
      const result = await cluster.query(query, { parameters: { email: req.body.email } });

        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await createUser({ name, email, password, phone });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id, 'user'),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const cluster = getCluster();
        const query = `SELECT META().id, * FROM \`${process.env.COUCHBASE_BUCKET}\` WHERE type = 'user' AND email = $email LIMIT 1`;
        const result = await cluster.query(query, { parameters: { email } });

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id, 'user'),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ========== MECHANIC ==========

const registerMechanic = async (req, res) => {
    const { name, email, password, phone, garageName, servicesOffered } = req.body;
    try {
        const cluster = getCluster();
        const query = `SELECT META().id FROM \`${process.env.COUCHBASE_BUCKET}\` WHERE type = 'mechanic' AND email = $email LIMIT 1`;
        const result = await cluster.query(query, { parameters: { email } });

        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'Mechanic already exists' });
        }

        const mechanic = await createMechanic({
            name,
            email,
            password,
            phone,
            garageName,
            servicesOffered,
        });

        res.status(201).json({
            _id: mechanic.id,
            name: mechanic.name,
            email: mechanic.email,
            token: generateToken(mechanic.id, 'mechanic'),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginMechanic = async (req, res) => {
    const { email, password } = req.body;
    try {
        const cluster = getCluster();
        const query = `SELECT META().id, * FROM \`${process.env.COUCHBASE_BUCKET}\` WHERE type = 'mechanic' AND email = $email LIMIT 1`;
        const result = await cluster.query(query, { parameters: { email } });

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const mechanic = result.rows[0];
        const isMatch = await bcrypt.compare(password, mechanic.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: mechanic.id,
            name: mechanic.name,
            email: mechanic.email,
            token: generateToken(mechanic.id, 'mechanic'),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    registerMechanic,
    loginMechanic,
};
