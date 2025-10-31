"use strict";
// import mongoose from "mongoose";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
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
const mongoose_1 = __importDefault(require("mongoose"));
const URI = process.env.MONGODB_URI; // Use MONGODB_URI for clarity
if (!URI) {
    throw new Error("❌ MongoDB connection string not found in environment variables");
}
// Use a global variable to avoid multiple connections (important for Vercel)
let isConnected = false;
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isConnected) {
        console.log("🟢 Using existing MongoDB connection");
        return;
    }
    try {
        const db = yield mongoose_1.default.connect(URI);
        isConnected = !!db.connections[0].readyState;
        console.log("✅ MongoDB Connected Successfully");
    }
    catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        throw new Error("MongoDB connection failed");
    }
});
exports.dbConnection = dbConnection;
