import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private';

export const connectDB = async () => {
	if (mongoose.connection.readyState === 1) {
		return;
	}

	try {
		await mongoose.connect(MONGO_URI);
		console.log('MongoDB Mongoose Connected');
	} catch (error) {
		console.error('Database connection error:', error);
	}
};