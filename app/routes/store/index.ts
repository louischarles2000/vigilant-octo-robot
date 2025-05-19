import express from "express";
import storeHandlers from "../../controllers/store"

const router = express.Router();

router.get("/currency", storeHandlers.storeQueryControllers.getStoreCurrency);

export { router as storeRouter };