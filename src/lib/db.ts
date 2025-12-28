import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private';

export const connectDB = async () => {
	if (mongoose.connections[0].readyState) return;

	try {
		await mongoose.connect(MONGO_URI);
		console.log(`✅ MongoDB Bağlandı: ${mongoose.connection.name}`);
	} catch (error) {
		console.error('❌ Bağlantı Hatası:', error);
		throw error;
	}
};