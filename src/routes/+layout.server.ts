import { db } from '$lib/db';

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