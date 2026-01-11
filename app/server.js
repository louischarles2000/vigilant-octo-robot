"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
// import sequelize from './config/db';
const port = process.env.PORT || 3001; // Use environment variable for port if available
const host = '0.0.0.0'; // Bind to all network interfaces (allows external access)
// Start the server and listen on the specified port and host
app_1.default.listen(port, host, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the database
        // await sequelize.authenticate();
        console.log("Database has been established successfully.");
    }
    catch (error) {
        console.error("Error establishing connection:", error);
    }
    console.log(`Server started on port ${port} and accessible at http://${host}:${port}`);
}));
