import express from "express" ;
import authHandlers from "../../controllers/auth";

const router = express.Router();


router.post("/create", authHandlers.authMutationController);
router.post("/login", authHandlers.authMutationController);

export { router as authRouter };