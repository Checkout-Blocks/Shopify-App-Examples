import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/*
    The storeCallback takes in a key of id and the Session, and stores it in Redis
    This callback is used for BOTH saving new Sessions and updating existing Sessions.
    If the session can be stored, return true
    Otherwise, return false
*/
const storeCallback = async (id, session) => {
    try {
        await redis.set(id, session);
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

/*
    The loadCallback takes in the id, and uses the Redis get method to access the session data
    If a stored session exists, it's parsed and returned
    Otherwise, return undefined
*/
const loadCallback = async (id) => {
    try {
        const session = await redis.get(id);

        if (!session) return false;

        return session;
    } catch (err) {
        throw new Error(err);
    }
};

/*
    The deleteCallback takes in the id, and uses the Redis del method to delete it from the database
    If the session can be deleted, return true
    Otherwise, return false
*/
const deleteCallback = async (id) => {
    try {
        await redis.del(id);
        return true;
    } catch (err) {
        throw new Error(err);
    }
};

export default {
    storeCallback,
    loadCallback,
    deleteCallback,
};
