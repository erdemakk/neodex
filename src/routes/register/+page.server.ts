import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const email = data.get('email');
		const password = data.get('password');
		await db.collection('users').insertOne({
			username,
			email,
			password,
			balance: 100,
			createdAt: new Date()
		});
		throw redirect(303,'/');
	}
};