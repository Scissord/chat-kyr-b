import bcrypt from 'bcryptjs';
import * as User from "../models/user.js";
import * as UserToken from "../models/user_token.js";
import * as Role from "../models/role.js";
import generateTokens from '../helpers/generateTokens.js';

export const login = async (req, res) => {
	try {
		const { name, password } = req.body;

		const user = await User.findByName(name);
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if(!user) return res.status(400).send({ error: "Такого пользователя нет!" });
		if(!isPasswordCorrect) return res.status(400).send({ error: "Неверный пароль" });

    // generate JWT TOKEN
    const { accessToken, refreshToken } = generateTokens(user.id);

    // save refreshToken in DB
    await UserToken.update(user.id, {
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 дней
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      httpOnly: true, // Защищает от XSS атак
      sameSite: "strict", // Защита от CSRF атак
      secure: process.env.NODE_ENV === "production", // Только в производственной среде
    });

    const role = await Role.getForUser(user.role);
    user.role = role;

		res.status(200).send({ message: "Successfully login", user, accessToken });
	}	catch (err) {
		console.log("Error in login controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("refreshToken", "", { maxAge: 0 })

		res.status(200).send({ message: "Successfully logout" });
	}	catch (err) {
		console.log("Error in logout controller", err.message);
		res.status(500).send({ error: "Internal Server Error" });
	}
};
