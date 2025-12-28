import { connectDB } from '$lib/db';
import { User } from '$lib/server/models/User';
import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const session = cookies.get('session');

	if (!session) {
		return { user: null };
	}

	await connectDB();

	try {
		const user = await User.findOne({
			$or: [
				{ username: session },
				{ address: session }
			]
		}).lean();

		if (!user) {
			return { user: null };
		}

		return {
			user: {
				username: user.username,
				address: user.address,
				email: user.email,
				balances: user.balances,
				_id: user._id.toString()
			}
		};

	} catch (error) {
		console.error('Veri Çekme Hatası:', error);
		return { user: null };
	}
};

export const actions = {
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		throw redirect(303, '/');
	}
} satisfies Actions;