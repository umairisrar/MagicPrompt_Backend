import express from "express";
import {
  createUser,
  getUser,
  subscriptionUser,
} from "../controllers/userController.js";
var UserRouter = express.Router();

UserRouter.post("/postuser", createUser);
UserRouter.get("/getusers", getUser);
UserRouter.get("/subscriptionuser", subscriptionUser);

export default UserRouter;
