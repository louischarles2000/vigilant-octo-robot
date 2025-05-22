import express from "express";
import contactHandlers from "../../controllers/contact";

const router = express.Router();

router.post("/", contactHandlers.contactMutationControllers.createContact);

export { router as contactRouter };