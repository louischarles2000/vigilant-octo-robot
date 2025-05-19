import express from "express" ;
import roleHandlers from "../../controllers/roles";
import { verifyJWT } from "../../middlewares/verifyJWT";
import verifyRoles from "../../middlewares/verifyRoles";


const router = express.Router();


router.get("/", verifyJWT, verifyRoles(['ec8230fa-d069-497d-b1d4-356d3b037b17']), roleHandlers.rolesQueryControllers.getRoles);

export { router as rolesRouter };


