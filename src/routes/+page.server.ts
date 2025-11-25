import { db } from '$lib/db';
import { type Actions, redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const username = cookies.get('session');

	if (!username) {
		return { user: null };
	}

	const user = await db.collection('users').findOne({ username });

	return {
		user: user ? JSON.parse(JSON.stringify(user)) : null
	};
};

export const actions = {
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		throw redirect(303, '/');
	}
} satisfies Actions;