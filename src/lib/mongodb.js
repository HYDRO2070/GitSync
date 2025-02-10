import { MongoClient } from "mongodb";

const clientPromise = new MongoClient(process.env.MONGODB_URI).connect();

export default clientPromise;
