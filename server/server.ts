import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import socialAuthRouter from "./routes/socialAuthRoute.js";
import accountRouter from "./routes/accountRoute.js";

const app = express();

//Database connection
await connectDB()

// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/auth', authRouter);
app.use('/api/oauth', socialAuthRouter);
app.use('/api/accounts', accountRouter);


//Global Error Handler
app.use((err : any , _req : Request , res : Response , _next : NextFunction)=> {
    console.log(err);
    res.status(500).send(err?.response?.data?.message || err.message)
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});