// $lib/db.ts
import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private';

export const connectDB = async () => {
	// Bağlantı zaten varsa beklemeden dön
	if (mongoose.connection.readyState === 1) return;

	try {
		await mongoose.connect(MONGO_URI);
		console.log('✅ MongoDB Bağlantısı Başarılı');
	} catch (error) {
		console.error('❌ MongoDB Bağlantı Hatası:', error);
		// Hatayı yukarı fırlatmalıyız ki server.ts bunu fark etsin
		throw new Error('Veritabanına bağlanılamadı');
	}
};