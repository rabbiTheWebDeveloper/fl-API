import mongoose from "mongoose";

const URI: string | undefined = process.env.URI; // Use the specific environment variable name

const dbConnection = async (): Promise<void> => {
    try {
        if (!URI) {
            console.log("No URL Found");
        } else {
            await mongoose.connect(URI);
            console.log("Connected");
        }
    } catch (error) {
        console.log("Error connecting:", error);
    }
}

export { dbConnection }
