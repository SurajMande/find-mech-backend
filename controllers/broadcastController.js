const { getCollection } = require('../config/db');

const broadcastRequest = async (req, res) => {
    const { lat, lng, requestId } = req.body;
    const collection = getCollection();

    const query = `
        SELECT META().id, name, location, isAvailable
        FROM \`${process.env.COUCHBASE_BUCKET}\`
        WHERE type = 'mechanic' AND isAvailable = TRUE;
    `;

    try {
        const result = await collection._scope._cluster.query(query);
        const mechanics = result.rows;

        req.io.to('mechanics').emit('new_job', {
            requestId,
            lat,
            lng,
        });

        res.json({
            success: true,
            mechanicsFound: mechanics.length,
            message: 'Request broadcasted to available mechanics',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error broadcasting request' });
    }
};

module.exports = {
    broadcastRequest,
};
