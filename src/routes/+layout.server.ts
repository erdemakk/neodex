import { connectDB } from '$lib/db';
import { User } from '$lib/server/models/User';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const session = cookies.get('session');

	// Terminali kontrol et: Bu satır yazıyor mu?
	console.log('Layout Server Session Kontrolü:', session ? session : 'Session YOK');

	if (!session) {
		return { user: null };
	}

	try {
		await connectDB();

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
				_id: user._id.toString()
			}
		};

	} catch (error) {
		console.error('DB Hatası:', error);
		return { user: null };
	}
};