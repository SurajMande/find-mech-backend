const { getCollection } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Create a new user with password hashing
const createUser = async ({
    name,
    phone,
    email,
    password,
    location = { type: 'Point', coordinates: [0, 0] },
    isVerified = false,
    role = 'user'
}) => {
    const collection = getCollection();
    const userId = `user::${uuidv4()}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userDoc = {
        type: 'user',
        name,
        phone,
        email,
        password: hashedPassword,
        location,
        isVerified,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    await collection.upsert(userId, userDoc);
    return { id: userId, ...userDoc };
};

// Get user by ID
const getUserById = async (userId) => {
    const collection = getCollection();
    const result = await collection.get(userId);
    return result.content;
};

// Verify password
const comparePassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = {
    createUser,
    getUserById,
    comparePassword
};
