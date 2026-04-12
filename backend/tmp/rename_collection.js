import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_CONNECTIONSTRING;

async function renameCollection() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);

    if (names.includes("userhistories")) {
      const count = await db.collection("userhistories").countDocuments();
      if (count === 0) {
        console.log("Empty 'userhistories' found, deleting it...");
        await db.collection("userhistories").drop();
        console.log("'userhistories' dropped.");
      } else {
        console.log("Error: 'userhistories' is not empty. Cannot rename safely.");
        await mongoose.disconnect();
        return;
      }
    }

    if (names.includes("transactionhistories")) {
      await db.collection("transactionhistories").rename("userhistories");
      console.log("Renamed 'transactionhistories' to 'userhistories'");
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error renaming collection:", error);
    process.exit(1);
  }
}

renameCollection();
