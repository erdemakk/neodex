import { connectDB } from '$lib/db';
import { User } from '$lib/server/models/User';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		await connectDB();

		const usersData = await User.find({}, 'username').lean();
		const userList = usersData.map(u => u.username).filter(u => u);

		return {
			user: locals.user,
			allUsers: userList
		};

	} catch (error) {
		console.error(error);
		return {
			user: locals.user,
			allUsers: []
		};
	}
};