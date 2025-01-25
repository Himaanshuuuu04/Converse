import express from 'express'
import authRouter from './routes/auth.route.mjs'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.mjs'
dotenv.config()
const app = express()
const PORT = process.env.PORT
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello");
});
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
    connectDB();
})