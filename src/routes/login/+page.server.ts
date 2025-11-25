import { db } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return fail(400, { message: "Missing username or password." });
		}

		const user = await db.collection('users').findOne({ username });

		if (!user || user.password !== password) {
			return fail(400, { message: "Invalid username or password." });
		}

		cookies.set('session', username as string, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7
		});

		throw redirect(303, '/');
	}
};