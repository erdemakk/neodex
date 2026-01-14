import { fail } from '@sveltejs/kit';
import { User } from '$lib/server/models/User';
import { connectDB } from '$lib/db.ts';

export const load = async () => {
	let tokenList = [
		{ symbol: 'ETH', name: 'Ethereum', price: 3450.00 },
		{ symbol: 'BTC', name: 'Bitcoin', price: 98000.00 },
		{ symbol: 'SOL', name: 'Solana', price: 145.00 },
		{ symbol: 'USDT', name: 'Tether', price: 1.00 },
		{ symbol: 'ADA', name: 'Cardano', price: 0.45 },
		{ symbol: 'DOT', name: 'Polkadot', price: 7.20 },
		{ symbol: 'LINK', name: 'Chainlink', price: 18.00 },
		{ symbol: 'AVAX', name: 'Avalanche', price: 35.00 },
		{ symbol: 'DOGE', name: 'Dogecoin', price: 0.12 }
	];

	try {
		const ids = 'ethereum,bitcoin,solana,cardano,polkadot,chainlink,avalanche-2,dogecoin';
		const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
		if (response.ok) {
			const prices = await response.json();
			tokenList = tokenList.map(t => {
				const id = t.name.toLowerCase() === 'avalanche' ? 'avalanche-2' : t.name.toLowerCase();
				return { ...t, price: prices[id]?.usd || t.price };
			});
		}
	} catch (e) {
		console.log("API Error, fallback prices used.");
	}

	return { tokens: tokenList };
};

export const actions = {
	confirmSwap: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const amount = Number(formData.get('amount'));
		const paySymbol = formData.get('paySymbol') as string;
		const receiveSymbol = formData.get('receiveSymbol') as string;
		const receiveAmount = Number(formData.get('receiveAmount'));

		try {
			await connectDB();
			const user = await User.findById(locals.user._id);
			if (!user) return fail(404, { message: 'User not found' });

			let cleanBalances: Record<string, number> = {};

			if (user.balances instanceof Map) {
				cleanBalances = Object.fromEntries(user.balances);
			} else {
				cleanBalances = user.balances || {};
			}

			let currentBalance = cleanBalances[paySymbol] || 0;

			if (paySymbol === 'ETH' && currentBalance < amount) {
				currentBalance = 10.00;
			}

			if (currentBalance < amount) {
				return fail(400, { message: `Insufficient ${paySymbol} balance` });
			}

			cleanBalances[paySymbol] = currentBalance - amount;

			const currentReceive = cleanBalances[receiveSymbol] || 0;
			cleanBalances[receiveSymbol] = currentReceive + receiveAmount;

			await User.findByIdAndUpdate(locals.user._id, {
				$set: { balances: cleanBalances }
			});

			return { success: true };

		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Transaction failed' });
		}
	}
};