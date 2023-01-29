"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPassword = exports.encryptPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function encryptPassword(data) {
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        const hash = await bcrypt_1.default.hash(data, salt);
        return hash;
    }
    catch (error) {
        return error;
    }
}
exports.encryptPassword = encryptPassword;
async function decryptPassword(plain_password, encrypted_password) {
    try {
        const match = await bcrypt_1.default.compare(plain_password, encrypted_password);
        return match;
    }
    catch (error) {
        return error;
    }
}
exports.decryptPassword = decryptPassword;
//# sourceMappingURL=hashPassword.js.map