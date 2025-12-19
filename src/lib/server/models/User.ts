import mongoose from 'mongoose';

// Önceki modelleri hafızadan sil (Cache temizliği)
delete mongoose.models.User;
delete mongoose.models.UserNew;

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	email: {
		type: String,
		required: false, // <-- KESİN: Zorunlu değil
		unique: true,
		sparse: true,    // <-- Email yoksa hata verme
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		required: false  // <-- KESİN: Zorunlu değil
	},
	address: {
		type: String,
		required: false,
		unique: true,
		sparse: true
	},
	balances: {
		usdt: { type: Number, default: 1000 },
		neo: { type: Number, default: 100 }
	},
	createdAt: { type: Date, default: Date.now }
});

// Model ismini 'UserNew' yaparak veritabanını sıfırdan tablo açmaya zorluyoruz
// Böylece eski hatalı verilerle çakışmayacak.
export const User = mongoose.model('UserNew', userSchema);