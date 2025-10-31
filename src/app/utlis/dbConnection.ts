// import mongoose from "mongoose";

// const URI: string | undefined = process.env.URI; // Use the specific environment variable name

// const dbConnection = async (): Promise<void> => {
//     try {
//         if (!URI) {
//             console.log("No URL Found");
//         } else {
//             await mongoose.connect(URI);
//             console.log("Connected");
//         }
//     } catch (error) {
//         console.log("Error connecting:", error);
//     }
// }

// export { dbConnection }


import mongoose from "mongoose";

const URI = process.env.MONGODB_URI as string; // Use MONGODB_URI for clarity

if (!URI) {
  throw new Error("❌ MongoDB connection string not found in environment variables");
}

// Use a global variable to avoid multiple connections (important for Vercel)
let isConnected = false;

export const dbConnection = async (): Promise<void> => {
  if (isConnected) {
    console.log("🟢 Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(URI);
    isConnected = !!db.connections[0].readyState;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("MongoDB connection failed");
  }
};
