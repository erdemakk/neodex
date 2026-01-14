import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db';
import { User } from '$lib/server/models/User';

export const GET = async ({ cookies }) => {
	const session = cookies.get('session');
	if (!session) return json({ user: null });

	await connectDB();

	const user = await User.findOne({ address: session });
	if (!user) return json({ user: null });

	return json({ user });
};
