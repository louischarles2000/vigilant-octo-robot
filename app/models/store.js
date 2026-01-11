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
const db_1 = __importDefault(require("../config/db"));
const helpers_1 = require("../utils/helpers");
exports.default = {
    fetchStoreCurrency: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = `
        SELECT
          *
        FROM ${helpers_1.tables.currency}
        WHERE code IN (SELECT value FROM ${helpers_1.tables.setting} WHERE \`key\` = 'config_currency')
      `;
            const [results] = yield db_1.default.query(query);
            return results[0];
        }
        catch (error) {
            console.error('[Model] Error fetching storeCurrency by ID:', error);
            throw error;
        }
    })
};
