const { getCollection } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Create a new mechanic
const createMechanic = async ({
    name,
    phone,
    email,
    password,
    garageName,
    servicesOffered = [],
    location = { type: 'Point', coordinates: [0, 0] },
    isAvailable = true,
    rating = 0,
    profileImage = ''
}) => {
    const collection = getCollection();
    const mechanicId = `mechanic::${uuidv4()}`;

    const mechanicDoc = {
        type: 'mechanic',
        name,
        phone,
        email,
        password,
        garageName,
        servicesOffered,
        location,
        isAvailable,
        rating,
        profileImage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    await collection.upsert(mechanicId, mechanicDoc);
    return { id: mechanicId, ...mechanicDoc };
};

// Get mechanic by ID
const getMechanicById = async (mechanicId) => {
    const collection = getCollection();
    const result = await collection.get(mechanicId);
    return result.content;
};

// Update mechanic availability
const updateMechanicAvailability = async (mechanicId, isAvailable) => {
    const collection = getCollection();
    const mechanic = await getMechanicById(mechanicId);
    mechanic.isAvailable = isAvailable;
    mechanic.updatedAt = new Date().toISOString();
    await collection.replace(mechanicId, mechanic);
    return mechanic;
};

module.exports = {
    createMechanic,
    getMechanicById,
    updateMechanicAvailability
};
