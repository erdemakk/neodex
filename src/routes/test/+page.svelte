<script lang="ts">
	// --- 1. CÜZDAN KISMI (ESKİSİ) ---
	let wallet = $state<{ address: string | null }>({ address: null });

	const connectWallet = () => {
		const randomHex = Math.random().toString(16).slice(2);
		wallet.address = "0x" + randomHex;
	};
	const disconnectWallet = () => { wallet.address = null; };

	// --- 2. YENİ KISIM: COIN LİSTESİ ---
	// Statik (sabit) bir liste oluşturduk.
	// Gerçek projede bu veriler internetten (API) gelir.
	let coins = $state([
		{ name: 'Bitcoin', symbol: 'BTC', price: 96500, color: 'bg-orange-500' },
		{ name: 'Ethereum', symbol: 'ETH', price: 3700, color: 'bg-blue-600' },
		{ name: 'Solana', symbol: 'SOL', price: 245, color: 'bg-purple-500' },
		{ name: 'Tether', symbol: 'USDT', price: 1.00, color: 'bg-green-500' }
	]);
</script>

<div class="relative bg-gray-900 h-screen flex flex-col items-center pt-32 text-white font-sans overflow-hidden">

	<h1 class="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-12">
		Market Overview
	</h1>

	<div class="grid grid-cols-2 gap-6 w-[600px]">

		{#each coins as coin}

			<div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex items-center justify-between hover:scale-105 transition-transform cursor-pointer">

				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-full {coin.color} flex items-center justify-center font-bold text-xl">
						{coin.symbol[0]} </div>

					<div class="flex flex-col">
						<span class="font-bold text-lg">{coin.name}</span>
						<span class="text-gray-400 text-sm">{coin.symbol}</span>
					</div>
				</div>

				<div class="text-right">
					<div class="font-mono text-xl font-bold">${coin.price.toLocaleString()}</div>
					<div class="text-xs text-green-400">+2.4%</div> </div>

			</div>

		{/each}
	</div>


	<div class="absolute top-6 right-6">
		{#if wallet.address}
			<div class="w-[300px] h-[60px] flex items-center justify-between px-6 bg-gray-800 border border-gray-700 rounded-full shadow-lg">
				<div class="flex items-center gap-3">
					<div class="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
					<span class="font-mono text-green-400 font-bold text-lg">
            {wallet.address.slice(0,6)}...
          </span>
				</div>
				<button onclick={disconnectWallet} class="text-red-400 hover:text-red-300 text-sm font-bold cursor-pointer hover:underline">Çıkış</button>
			</div>
		{:else}
			<button onclick={connectWallet} class="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 cursor-pointer">Connect Wallet</button>
		{/if}
	</div>

</div>