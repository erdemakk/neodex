import { connectDB } from '$lib/db';
import { User } from '$lib/server/models/User';

export const load = async ({ cookies }) => {
	const username = cookies.get('session');

	if (!username) {
		return { user: null };
	}

	try {
		await connectDB();

		const user = await User.findOne({ username }).lean();

		if (!user) {
			return { user: null };
		}

		return {
			user: {
				username: user.username,
				email: user.email,
				address: user.address || null,
				balances: user.balances,
				_id: user._id.toString()
			}
		};

	} catch (error) {
		console.error(error);
		return { user: null };
	}
};