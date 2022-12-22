import { fetchMongodb } from '@api-lib/mongodb';

const COLLECTION_SHOPS = "shops";

const shop = {
    get: async (shop, options = {}) => {
        const db = await fetchMongodb();
        const shopDoc = await db.collection(COLLECTION_SHOPS)
            .findOne({ shop, ...options });
            
        if (!shopDoc) {
            throw `Can't find shopDoc of ${shop}`
        }
        return shopDoc;
    }
}

export default shop;