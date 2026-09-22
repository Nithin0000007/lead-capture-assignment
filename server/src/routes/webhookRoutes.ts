import { Router } from "express";
import { handleMetaWebhook } from "../controllers/webhookController";

const router = Router();

router.post("/meta-lead", handleMetaWebhook);

export default router;
