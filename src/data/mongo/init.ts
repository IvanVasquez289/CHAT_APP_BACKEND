import mongoose from "mongoose";


export class ConnectDB {

    static async init() {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI!) 
            console.log(`MongoDB connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`Error connecting to MongoDB: ${error}`);
            process.exit(1); // Exit the process with failure
        }
    }
}