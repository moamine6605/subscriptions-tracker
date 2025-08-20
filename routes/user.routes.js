import { Router } from "express"
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";


const userRouter = Router(); 


userRouter.get('/',authorize, getUsers) 
userRouter.get('/:id',authorize, getUser) 

userRouter.get('/sign-out', (req, res)=> res.send({title: "signout"})) 


export default userRouter;