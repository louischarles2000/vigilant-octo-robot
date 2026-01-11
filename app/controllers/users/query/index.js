"use strict";
// import { Request, Response } from "express";
// import User from "../../../models/users";
// export const userQueryControllers = {
//   getUsers: async (_req: any, res: any) => {
//     try {
//       const users = await User.findAll();
//       return res.json(users);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Error fetching users" });
//     }
//   },
//   getUserById: async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       const user = await User.findByPk(id);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       return res.json(user);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Error fetching user" });
//     }
//   },
// };
