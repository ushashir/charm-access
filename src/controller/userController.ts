import {
	registerUSerSchema,
	loginUserSchema
} from "../utils/validation";
import prisma from "../utils/prismaClient";
import jwt from "jsonwebtoken";
import { decryptPassword, encryptPassword } from "../utils/hashPassword";
import { generateAccessToken } from "../utils/authMiddleWare";

export async function registerUser(data: Record<string, unknown>) {
	const validData = registerUSerSchema.safeParse(data);
	if (!validData.success) {
		throw validData.error;
	}
	const record = validData.data;

	// check for duplicate mail, phone and username
	const duplicateMail = await prisma.user.findFirst({
		where: { email: record.email },
	});
	if (duplicateMail) throw "Email already exist";

	const response = prisma.user.create({
		data: {
			firstName: record.firstName,
			lastName: record.lastName,
			email: record.email,
            phone: record.phone,
			password: (await encryptPassword(record.password)) as string,
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

export async function loginUser(data: Record<string, unknown>) {
	const isValidData = loginUserSchema.safeParse(data);

	if (!isValidData.success) {
		throw isValidData.error;
	}
	const record = isValidData.data;

	let user;
	if (record.email) {
		user = await prisma.user.findUnique({ where: { email: record.email } });
	} 
	if (!user) {
		throw "No user with email found. Please signup";
	}

	const match = await decryptPassword(record.password, user.password);

	if (!match) {
		throw "Incorrect password. Access denied";
	}
	const {
		id,
		firstName,
		lastName,
		email,
		phone,
	} = user;
	return {
		token: generateAccessToken(user.id as unknown as string),
		userdata: {
			id,
			firstName,
			lastName,
			email,
			phone
		},

	};
}


export async function getById(id: string) {
	return await prisma.user.findUnique({
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

