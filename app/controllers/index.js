"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const roles_1 = __importDefault(require("./roles"));
const users_1 = __importDefault(require("./users"));
exports.default = {
    authControllers: auth_1.default,
    rolesControllers: roles_1.default,
    userControllers: users_1.default,
};
