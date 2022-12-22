import Analytics from "analytics-node";

const AnalyticsClient = process.env.SEGMENT_WRITE_KEY
    ? new Analytics(process.env.SEGMENT_WRITE_KEY)
    : false;

if (!AnalyticsClient) {
    console.warn(`!!! Missing SEGMENT_WRITE_KEY environment variable. Events will not be sent.\n`);
}

export default AnalyticsClient;