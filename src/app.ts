import 'dotenv/config'
import cors from 'cors'
import express from 'express';
import authRoutes from './routes/auth.route'
import messageRoutes from './routes/message.route'
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db';
import { app, server } from './lib/socket.io';


const PORT = process.env.PORT || 4000;

// middlewares
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// routes
app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

// start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB()
})