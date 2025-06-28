const couchbase = require('couchbase');
require('dotenv').config();
let cluster;
let bucket;
let collection;

const connectionString = process.env.COUCHBASE_CONN_STRING;
const username = process.env.COUCHBASE_USERNAME;
const password = process.env.COUCHBASE_PASSWORD;
const bucketName = process.env.COUCHBASE_BUCKET;
const scopeName = process.env.COUCHBASE_SCOPE_NAME || '_default';
const collectionName = process.env.COUCHBASE_COLLECTION_NAME || '_default';

const connectDB = async () => {
    if (!connectionString || !username || !password || !bucketName) {
        console.error("Missing Couchbase environment variables.");
        process.exit(1);
    }
    try {
        console.log('Connecting to Couchbase...');
        cluster = await couchbase.connect(connectionString, {
            username,
            password
        });
        bucket = cluster.bucket(bucketName);
        collection = bucket.scope(scopeName).collection(collectionName);
        console.log("Couchbase connected successfully.");
    } catch (err) {
        console.error("Couchbase connection failed:", err.message);
        process.exit(1);
    }
};

const getCollection = () => {
    if (!collection) throw new Error("Couchbase not connected yet.");
    return collection;
};

const getCluster = () => {
    if (!cluster) throw new Error("Couchbase not connected yet.");
    return cluster;
};

const disconnectDB = async () => {
    if (cluster) {
        await cluster.disconnect();
        console.log('Disconnected from Couchbase.');
    }
};

module.exports = { connectDB, getCollection, getCluster, disconnectDB };
