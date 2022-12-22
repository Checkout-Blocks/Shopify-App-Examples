import { MongoClient } from "mongodb";

let indexesCreated = false;
let clientPromise = null;
const clientOptions = {};

/**
 * Mongodb
 * 
 * Connect to Mongodb and set to common connection variable for pooling
 */
const { MONGO_DB, MONGO_URI } = process.env;

if (!process.env.MONGO_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGO_URI"')
}

// TODO: indexes
// async function createIndexes(client) {
//   if (indexesCreated) return client;
//   const db = client.db();
//   await Promise.all([
//     db
//       .collection('tokens')
//       .createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 }),
//     db
//       .collection('posts')
//       .createIndexes([{ key: { createdAt: -1 } }, { key: { creatorId: -1 } }]),
//     db
//       .collection('comments')
//       .createIndexes([{ key: { createdAt: -1 } }, { key: { postId: -1 } }]),
//     db.collection('users').createIndexes([
//       { key: { email: 1 }, unique: true },
//       { key: { username: 1 }, unique: true },
//     ]),
//   ]);
//   indexesCreated = true;
//   return client;
// }

export async function getMongoClient() {
    /**
     * Global is used here to maintain a cached connection across hot reloads
     * in development. This prevents connections growing exponentiatlly
     * during API Route usage.
     * https://github.com/vercel/next.js/pull/17666
     */
    //if (process.env.NODE_ENV === 'development') {
        if (!global.mongoClientPromise) {
            const client = new MongoClient(MONGO_URI, clientOptions);
            // client.connect() returns an instance of MongoClient when resolved
            global.mongoClientPromise = client
                .connect()
                .then((client) => {
                    //createIndexes(client) //TODO: ensure indexes are created
                    return client;
                });
        }
        return global.mongoClientPromise;
    // } else {
    //     // In production mode, it's best to not use a global variable.
    //     const client = new MongoClient(MONGO_URI, clientOptions)
    //     return clientPromise = client.connect().then((client) => {
    //         //createIndexes(client) //TODO: ensure indexes are created
    //         return client;
    //     });
    // }
}

export async function fetchMongodb(db = null) {
    const mongoClient = await getMongoClient();
    return mongoClient.db(db || MONGO_DB);
}