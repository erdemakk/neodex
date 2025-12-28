import { fail, redirect } from '@sveltejs/kit';
import { connectDB } from '$lib/db';
import { User } from '$lib/server/models/User';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString().trim();
		const password = data.get('password')?.toString().trim();

		if (!username || !password) {
			return fail(400, { message: "Kullanıcı adı veya şifre eksik." });
		}

		try {
			await connectDB();
			const user = await User.findOne({ username });

			if (!user || user.password !== password) {
				return fail(400, { message: "Geçersiz kullanıcı adı veya şifre." });
			}

			cookies.set('session', username, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: false,
				maxAge: 60 * 60 * 24 * 7
			});

		} catch (error) {
			console.error(error);
			return fail(500, { message: "Sunucu hatası oluştu." });
		}

		throw redirect(303, '/');
	}
};