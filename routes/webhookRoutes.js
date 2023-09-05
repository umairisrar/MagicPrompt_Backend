import express from "express";
import { handleWebhooks } from "../controllers/webhookController.js";
import bodyParser from "body-parser";
var router = express.Router();

router.post("/", handleWebhooks);

export default router;
