import express from 'express'
import authRouter from './routes/auth.route.mjs'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.mjs'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()
const app = express()
const PORT = process.env.PORT
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
));

app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
    connectDB();
})