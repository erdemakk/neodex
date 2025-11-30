import { connectDB } from '$lib/db';
import { User } from '$lib/server/models/User';

export const load = async ({ cookies }) => {
	const userAddress = cookies.get('session');

	if (!userAddress) {
		return { user: null };
	}

	try {
		await connectDB();

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
		};

	} catch (error) {
		console.error('Layout Load Hatası:', error);
		return { user: null };
	}
};