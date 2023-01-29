"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const authMiddleWare_1 = require("../utils/authMiddleWare");
const router = (0, express_1.Router)();
router.get("/", authMiddleWare_1.auth, async (req, res) => {
    try {
        const id = req.user.user_id;
        const response = await (0, userController_1.getById)(id);
        return res.status(200).json({ message: "success", response });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
/* POST register users*/
router.post("/", async (req, res) => {
    try {
        const data = req.body;
        const response = await (0, userController_1.registerUser)(data);
        return res.status(201).json({
            message: "Success",
            response
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error
        });
    }
});
/* POST Login users */
router.post("/login", async (req, res) => {
    try {
        const data = req.body;
        const response = await (0, userController_1.loginUser)(data);
        return res.status(200).json({
            message: "Success",
            response
        });
    }
    catch (error) {
        return res.status(400).json({ message: error });
    }
});
exports.default = router;
//# sourceMappingURL=userRoute.js.map