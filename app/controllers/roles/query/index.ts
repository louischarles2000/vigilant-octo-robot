// import { Request, Response } from "express";
// import Role from "../../../models/roles";

// export const rolesQueryControllers = {
//     getRoles: async (req: Request, res: Response) => {
//         try {
//             const roles = await Role.findAll();
//             res.status(200).json(roles);
//         } catch (error) {
//             console.error("Error fetching roles:", error);
//             res.status(500).json({ message: "Internal server error" });
//         }
//     }
// };

// export default rolesQueryControllers;