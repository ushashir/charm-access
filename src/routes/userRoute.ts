import { Router } from "express";
import {
	registerUser,
    loginUser,
    getById,
} from "../controller/userController";
import { auth } from "../utils/authMiddleWare";
import { userRequest } from "../types/express";

const router = Router();

router.get("/", auth, async (req: userRequest, res) => {
	try {
		const id = req.user.user_id
		const response = await getById(id)
		return res.status(200).json({ message: "success", response })
	} catch (error) {
		res.status(400).json(error)
	}
})

/* POST register users*/
router.post("/", async (req, res) => {
	try {
		const data = req.body;
		const response = await registerUser(data);
		return res.status(201).json({
			message: "Success",
			response
		});
	} catch (error) {
		return res.status(400).json({
			message: error
		});
	}
});

/* POST Login users */
router.post("/login", async (req, res) => {
	try {
		const data = req.body;
		const response = await loginUser(data);
		return res.status(200).json({
			message: "Success",
			response
		});
	} catch (error) {
		return res.status(400).json({ message: error });
	}
});


export default router;
