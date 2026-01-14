import { connectDB } from '$lib/db.ts';
import { User } from '$lib/server/models/User';

export const handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	if (!session) {
		event.locals.user = null;
	} else {
		try {
			await connectDB();

			const user = await User.findOne({
				$or: [
					{ username: session },
					{ address: session }
				]
			}).lean();

			if (user) {
				let balances = user.balances || {};
				let needsUpdate = false;

				if (!balances.ETH || balances.ETH < 1) {
					balances = {
						...balances,
						ETH: 10.00,
						USDT: 10000.00,
						BTC: 0.5
					};
					needsUpdate = true;
				}

				if (needsUpdate) {
					await User.findByIdAndUpdate(user._id, {
						$set: { balances: balances }
					});
				}

				event.locals.user = {
					_id: user._id.toString(),
					username: user.username,
					address: user.address,
					email: user.email,
					balances: balances
				};
			} else {
				event.locals.user = null;
			}
		} catch (error) {
			console.error(error);
			event.locals.user = null;
		}
	}

	return await resolve(event);
};