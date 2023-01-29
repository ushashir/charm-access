"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
dotenv_1.default.config();
const key = process.env.AUTH_SECRET;
function generateAccessToken(id) {
    const key = process.env.AUTH_SECRET;
    const token = jsonwebtoken_1.default.sign({ user_id: id }, key, {
        expiresIn: "7d",
    });
    return token;
}
exports.generateAccessToken = generateAccessToken;
async function auth(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization)
        return res.status(401).json({ error: "Access Denied, no token Provided" });
    try {
        const token = authorization.slice(7, authorization.length);
        const decoded = jsonwebtoken_1.default.verify(token, key);
        if (!decoded) {
            res.status(401).send("Unauthorized");
            return;
        }
        const { user_id } = decoded;
        const user = await prismaClient_1.default.user.findUnique({
            where: {
                id: user_id,
            },
        });
        if (!user) {
            res.status(401).send("please register to access our service");
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(400).send(error);
        return;
    }
}
exports.auth = auth;
//# sourceMappingURL=authMiddleWare.js.map