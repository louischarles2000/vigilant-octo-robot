// import { Request, Response } from "express";
// import User from "../../../models/users";

// export const userMutationControllers = {
//   // Update user details
//    updateUser: async (req: any, res: any) => {
//     try {
//       const { id } = req.params;
//       const updates = req.body;

//       const user = await User.findByPk(id);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       await user.update(updates);
//       return res.status(200).json({ message: "User updated successfully", user });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Server error while updating user" });
//     }
//   },
//   // Soft delete user (set deleted_at timestamp)
//    deleteUser: async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;

//       const user = await User.findByPk(id);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       await user.update({ deleted_at: new Date() });
//       return res.status(200).json({ message: "User deleted (archived) successfully" });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Server error while deleting user" });
//     }
//   },
//   // Restore a soft-deleted user (set deleted_at to null)
//    restoreUser: async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;

//       const user = await User.findByPk(id, { paranoid: false }); // needed to fetch soft-deleted users
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       await user.update({ deleted_at: null });
//       return res.status(200).json({ message: "User restored successfully", user });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Server error while restoring user" });
//     }
//   }
// };
