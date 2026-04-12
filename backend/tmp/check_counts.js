import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_CONNECTIONSTRING;

async function checkCollections() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);

    if (names.includes("transactionhistories")) {
      const count = await db.collection("transactionhistories").countDocuments();
      console.log(`'transactionhistories' count: ${count}`);
    }

    if (names.includes("userhistories")) {
      const count = await db.collection("userhistories").countDocuments();
      console.log(`'userhistories' count: ${count}`);
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error checking collections:", error);
  }
}

checkCollections();
