import { connectDB } from '$lib/db.ts';
import { User } from '$lib/server/models/User.ts';
import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const userAddress = cookies.get('session');

	if (!userAddress) {
		return { usder: null };
	}
	await connectDB();
	try {
		const user = await User.findOne({ address: userAddress }).lean();
		if (!user) {
			return { user: null };
		}
		return {
			user: {
				username: user.address.slice(0, 6) + '...' + user.address.slice(-4),
				address: user.address,
				balances: user.balances,
				_id: user._id.toString()
			}
		} ;
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