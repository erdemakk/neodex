import mongoose from 'mongoose';

const userSchema = new mongoose.Schema ({
	address: {
		type: String,
		required: true,
		unique: true
	},
	nonce: {
		type: String,
		default: () => Math.floor(Math.random() * 1000000).toString()
	},
	balances: {
		usdt: {type: Number, default: 1000 },
		neo: {type: Number, default: 100 }
	},
	createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);