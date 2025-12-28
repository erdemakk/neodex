import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true, trim: true },
	email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
	password: { type: String },
	address: { type: String, unique: true, sparse: true },
	balances: {
		usdt: { type: Number, default: 1000 },
		neo: { type: Number, default: 100 }
	}
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);