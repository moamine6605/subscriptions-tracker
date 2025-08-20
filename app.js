import express from "express";
import "dotenv/config.js";
import cors from "cors"
import cookieParser from 'cookie-parser';
import errorMiddleware from "./middlewares/error.middlewares.js";
import authRouter from "./routes/auth.routes.js";
import SubscriptionRouter from "./routes/subscription.routes.js";
import userRouter from "./routes/user.routes.js";
import connectDB from './database/mongodb.js'
import workflowRouter from "./routes/workflow.routes.js";


const app = express();
const PORT = process.env.PORT;


app.use(cors());
app.use(express.json());
app.use(errorMiddleware);
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', SubscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.listen(PORT, async ()=>{
    await connectDB()
    console.log(`listening on port: http://localhost:${PORT}`)
})

export default app;