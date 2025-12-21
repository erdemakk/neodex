<script lang="ts">
	let isWalletConnected = false;

	function toggleWallet() {
		isWalletConnected = !isWalletConnected;
	}
</script>

<section class="min-h-[80vh] flex flex-col items-center justify-center relative text-center">
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

	<div class="space-y-6 max-w-3xl px-4">
		<h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
			Next Gen <br />
			<span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
				Crypto Trading
			</span>
		</h1>

		<p class="text-gray-400 text-lg md:text-xl">
			Experience the future of decentralized exchange. <br class="hidden md:block" />
			Fast, secure, and purely on-chain liquidity.
		</p>
	</div>

	<div class="mt-10">
		{#if isWalletConnected}
			<div class="flex flex-col items-center gap-4">
				<button class="px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105">
					Swap Now &rarr;
				</button>
				<span class="text-xs text-green-500 font-mono bg-green-500/10 px-3 py-1 rounded-full">
					Connected: 0x71C...9A21
				</span>
			</div>
		{:else}
			<button on:click={toggleWallet} class="px-8 py-4 border-2 border-green-500 text-green-500 font-bold rounded-xl hover:bg-green-500/10 transition-all cursor-pointer">
				Connect Wallet
			</button>
		{/if}
	</div>
</section>