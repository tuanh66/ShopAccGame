import express from "express";
import { getTransferHistory } from "../controllers/transferController.js";

const router = express.Router();

router.get("/transfer-history", getTransferHistory);

export default router;
