import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/db';
import { User } from '$lib/server/models/User';

export const POST = async ({ request, cookies }) => {
	try {
		const { address } = await request.json();

		if (!address) return json({ error: 'Address required' }, { status: 400 });

		await connectDB();

		// Kullanıcı var mı bak, yoksa oluştur
		let user = await User.findOne({ address });
		if (!user) {
			user = await User.create({
				address,
				username: `User_${address.slice(2, 8)}`
			});
		}

		// --- KRİTİK AYAR BURASI ---
		// Localhost'ta çalışması için secure: false OLMALI
		cookies.set('session', address, {
			path: '/',          // Tüm sitede geçerli
			httpOnly: true,     // JavaScript erişemez (Güvenlik)
			sameSite: 'lax',    // Strict yerine Lax yapıyoruz ki yönlendirmelerde silinmesin
			secure: false,      // <--- BUNU FALSE YAPMAZSAN LOCALHOSTTA ÇALIŞMAZ
			maxAge: 60 * 60 * 24 * 7 // 1 hafta
		});
		// --------------------------

		console.log('Cookie set edildi:', address); // Terminalde bunu görmelisin

		return json({ success: true, user });

	} catch (error) {
		console.error('API Hatası:', error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};