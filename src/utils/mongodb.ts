import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl: string = process.env.MONGO_URL!;

export let memoryClient:any;

export async function connectToMongo() {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    const db = client.db("Alethea");
    memoryClient = db.collection("memory");

    console.log("Connected to MongoDB");
}