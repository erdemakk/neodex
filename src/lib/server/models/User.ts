import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: false,
		unique: true,
		sparse: true
	},
	nonce: {
		type: String,
		default: () => Math.floor(Math.random() * 1000000).toString()
	},
	balances: {
		usdt: { type: Number, default: 1000 },
		neo: { type: Number, default: 100 }
	},
	createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);