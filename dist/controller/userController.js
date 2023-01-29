"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getById = exports.loginUser = exports.registerUser = void 0;
const validation_1 = require("../utils/validation");
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const hashPassword_1 = require("../utils/hashPassword");
const authMiddleWare_1 = require("../utils/authMiddleWare");
async function registerUser(data) {
    const validData = validation_1.registerUSerSchema.safeParse(data);
    if (!validData.success) {
        throw validData.error;
    }
    const record = validData.data;
    // check for duplicate mail, phone and username
    const duplicateMail = await prismaClient_1.default.user.findFirst({
        where: { email: record.email },
    });
    if (duplicateMail)
        throw "Email already exist";
    const response = prismaClient_1.default.user.create({
        data: {
            firstName: record.firstName,
            lastName: record.lastName,
            email: record.email,
            phone: record.phone,
            password: (await (0, hashPassword_1.encryptPassword)(record.password)),
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
        },
    });
}
exports.registerUser = registerUser;
async function loginUser(data) {
    const isValidData = validation_1.loginUserSchema.safeParse(data);
    if (!isValidData.success) {
        throw isValidData.error;
    }
    const record = isValidData.data;
    let user;
    if (record.email) {
        user = await prismaClient_1.default.user.findUnique({ where: { email: record.email } });
    }
    if (!user) {
        throw "No user with email found. Please signup";
    }
    const match = await (0, hashPassword_1.decryptPassword)(record.password, user.password);
    if (!match) {
        throw "Incorrect password. Access denied";
    }
    const { id, firstName, lastName, email, phone, } = user;
    return {
        token: (0, authMiddleWare_1.generateAccessToken)(user.id),
        userdata: {
            id,
            firstName,
            lastName,
            email,
            phone
        },
    };
}
exports.loginUser = loginUser;
async function getById(id) {
    return await prismaClient_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
        },
    });
}
exports.getById = getById;
//# sourceMappingURL=userController.js.map