import { fail, redirect } from '@sveltejs/kit';
import { connectDB } from '$lib/db.ts';
import { User } from '$lib/server/models/User';

export const actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString().trim();
		const email = data.get('email')?.toString().trim();
		const password = data.get('password')?.toString().trim();

		if (!username || !email || !password) {
			return fail(400, { message: "Tüm alanları doldurunuz." });
		}

		try {
			await connectDB();

			const existingUser = await User.findOne({ $or: [{ username }, { email }] });
			if (existingUser) {
				return fail(400, { message: "Bu kullanıcı adı veya e-posta zaten kullanımda." });
			}

			const newUser = new User({
				username,
				email,
				password
			});

			await newUser.save();

		} catch (error) {
			console.error(error);
			return fail(500, { message: "Kayıt sırasında bir sunucu hatası oluştu." });
		}

		throw redirect(303, '/login');
	}
};