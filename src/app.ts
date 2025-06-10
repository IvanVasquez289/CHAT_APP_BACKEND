import express from 'express';
import authRoutes from './routes/auth.route'
import messageRoutes from './routes/message.route'
import { connectDB } from './lib/db';
import 'dotenv/config'
import cookieParser from 'cookie-parser';
const app = express()
const PORT = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// routes
app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB()
})