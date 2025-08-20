import { Router } from "express"
import { createSubscription, getUserSubscritption } from "../controllers/subscription.controller.js";
import authorize from "../middlewares/auth.middleware.js";


const SubscriptionRouter = Router(); 


SubscriptionRouter.get('/', (req, res)=> res.send({title: "get all subscriptions"})) 

// SubscriptionRouter.get('/:id',authorize, getUserSubscritptions) 

SubscriptionRouter.post('/',authorize, createSubscription) 

SubscriptionRouter.put('/:id', (req, res)=> res.send({title: "UPDATE subscription"}))

SubscriptionRouter.delete("/:id", (req, res)=> res.send({title: "DELETE subscription"}))

SubscriptionRouter.get('/user/:id',authorize, getUserSubscritption) 

SubscriptionRouter.put('/:id/cancel', (req, res)=> res.send("Cancel all user subscription"))

SubscriptionRouter.get("/upcoming-renewals", (req, res)=> res.send("getting all new renewals"))

export default SubscriptionRouter;