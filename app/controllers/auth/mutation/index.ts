// import { Request, Response } from 'express';
// import Role from "../../../models/roles";
// import User from "../../../models/users";
// import jwt from "jsonwebtoken";
// import bcryptjs from "bcryptjs";
// import dotenv from "dotenv";
// import { generateRefreshToken, generateTemporaryPassword } from "../../../utils/auth_utils";

// dotenv.config();

// export const authMutationController = {
//   // Create New User
//   createNewUser: async (req: any, res: any) => {
//     const {
//       first_name,
//       middle_name,
//       last_name,
//       email,
//       role_id,
//       phone_number,
//       password,
//     } = req.body;

//     if (!first_name || !last_name || !email || !role_id || !password) {
//       return res.status(400).json({ message: 'All required fields must be provided.' });
//     }

//     try {
//       const { JWT_SECRET, REFRESH_TOKEN_SECRET } = process.env;

//       if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
//         return res.status(500).json({ message: 'JWT secrets not configured properly.' });
//       }

//       const role = await Role.findOne({ where: { id: role_id } });
//       if (!role) {
//         return res.status(400).json({ message: 'Role not found.' });
//       }

//       const hashedPassword = await bcryptjs.hash(password, 10);
//       const refreshToken = jwt.sign({ email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
//       const issuedAt = new Date();

//       const newUser = await User.create({
//         first_name,
//         middle_name,
//         last_name,
//         email,
//         password: hashedPassword,
//         role_id,
//         phone_number,
//         refresh_token: refreshToken,
//         refresh_token_issued_at: issuedAt,
//       });

//       console.log('New user created:', email);
//       console.log('Refresh token:', refreshToken);

//       return res.status(201).json({
//         message: 'User created successfully.',
//         user: {
//           id: newUser.id,
//           email: newUser.email,
//           role: role.name,
//         },
//       });
//     } catch (error: any) {
//       console.error('Error creating user:', error.message || error);
//       return res.status(500).json({ message: 'Internal server error.' });
//     }
//   },
//   // Forgot Password Reset Link
//   forgotPasswordRestLink: async (req: Request, res: Response) => {
//     const { email } = req.body;

//     try {
//       const user = await User.findOne({ where: { email } });

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const tempPassword = generateTemporaryPassword();
//       const hashedPassword = await bcryptjs.hash(tempPassword, 10);
//       user.password = hashedPassword;

//       // Save updated password
//       await user.save();

//       console.log("Phone number:", user.phone_number, "Temp Password:", tempPassword);

//       return res.status(200).json({
//         message: "Temporary password generated and updated successfully.",
//         phone_number: user.phone_number,
//         tempPassword, // For testing/debugging only – remove in production!
//       });
//     } catch (error) {
//       console.error("Error resetting user password:", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   },
//   changePassword: async (req: any, res: Response) => {
//     const _email = req.user.email; // Assume user email comes from a verified JWT
  
//     const { currentPassword, newPassword } = req.body;
  
//     if (!currentPassword || !newPassword) {
//       return res
//         .status(400)
//         .json({ message: "Current and new passwords are required" });
//     }
  
//     try {
//       const user = await User.findOne({ where: { email: _email } });
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
//       if (!isPasswordValid) {
//         return res.status(400).json({ message: "Current password is incorrect" });
//       }
  
//       await User.update(
//         { must_change_password: false },
//         { where: { email: _email } }
//       );
  
//       const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
//       user.password = hashedNewPassword;
//       await user.save();
  
//       res.status(200).json({ message: "Password changed successfully" });
//     } catch (error: any) {
//       console.error("Error changing password:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
//   handleLogin: async (req: Request, res: any) => {
//     const { email, password } = req.body;
  
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }
  
//     try {
//       if (!process.env.JWT_SECRET) {
//         return res.status(500).json({ message: "JWT secret not configured" });
//       }
  
//       const user = await User.findOne({
//         where: { email },
//         include: [
//           {
//             model: Role,
//             attributes: ["name"],
//           },
//         ],
//       });
  
//       if (!user) {
//         return res.status(401).json({ message: "Invalid Email" });
//       }
  
//       const passwordMatch = await bcryptjs.compare(password, user.password);
//       if (!passwordMatch) {
//         return res.status(401).json({ message: "Invalid password" });
//       }
  
//       const accessToken = jwt.sign(
//         { email: user.email, roles: user.role_id },
//         process.env.JWT_SECRET,
//         { expiresIn: "30d" }
//       );
  
//       const refreshToken = generateRefreshToken();
  
//       await user.save();
  
//       res.status(201).json({ accessToken, refreshToken, user });
//     } catch (error: any) {
//       console.error("Error during login:", error);
//       res.status(500).json({ error: error.message });
//     }
//   },
//   handleLogout: async (req: Request, res: Response) => {
//     const authHeader = req.headers["authorization"];
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Access token missing or invalid" });
//     }
  
//     const accessToken = authHeader.split(" ")[1];
  
//     try {
//       if (!process.env.JWT_SECRET) {
//         return res.status(500).json({ message: "JWT secret not configured" });
//       }
  
//       const decoded: any = jwt.verify(accessToken, process.env.JWT_SECRET);
  
//       const user = await User.findOne({ where: { email: decoded.email } });
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       if (!user.refresh_token) {
//         return res
//           .status(403)
//           .json({ message: "No refresh token found. User is not logged in." });
//       }
  
//       user.refresh_token = null;
//       await user.save();
  
//       res.status(201).json({ message: "Logout successful" });
//     } catch (error) {
//       res.status(401).json({ message: "Invalid access token" });
//     }
//   },
//   forgotPassword: async (req: Request, res: Response) => {
//     const { email } = req.body;
  
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }
  
//     try {
//       const user = await User.findOne({ where: { email } });
  
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       if (!process.env.JWT_SECRET) {
//         throw new Error("JWT secret is not configured");
//       }
  
//       const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
//       const tempPassword = Math.random().toString(36).slice(-8);
//       const hashedTempPassword = await bcryptjs.hash(tempPassword, 10);
  
//       await User.update(
//         { password: hashedTempPassword, must_change_password: true },
//         { where: { email } }
//       );
  
//       const phone_number = user.phone_number;
  
//       if (!phone_number) {
//         return res.status(404).json({ message: "Phone number not found for the user" });
//       }
  
//       res.status(200).json({ message: "Password reset link sent successfully via SMS." });
//     } catch (error: any) {
//       console.error("Error sending password reset SMS:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
// };

// export default authMutationController