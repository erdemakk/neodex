import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db';
import { User } from '$lib/server/models/User';

export const POST = async ({ request, cookies }) => {
	try {
		const { address } = await request.json();

		if (!address) {
			return json({ error: 'Address required' }, { status: 400 });
		}

		await connectDB();

		let user = await User.findOne({ address });

		if (!user) {
			user = await User.create({ address });
			console.log('New user created:', address);
		} else {
			console.log('User logged in:', address);
		}

		cookies.set('session', address, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7
		});

		return json({ success: true, user });

	} catch (error) {
		console.error('Login API Error:', error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};