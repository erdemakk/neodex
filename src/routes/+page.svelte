<script lang="ts">
	export let data;

	let showLoginModal = false;

	function handleBigButton() {
		if (!data.user) {
			showLoginModal = true;
		} else {
			console.log("Kullanıcı zaten giriş yapmış, ticarete başla!");
		}
	}
</script>

{#if showLoginModal}
	<div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm">
		<div class="bg-black border border-[#00ff9d]/30 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,255,157,0.15)] relative">
			<button on:click={() => showLoginModal = false} class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">✕</button>
			<div class="text-5xl mb-4">🔒</div>
			<h3 class="text-xl font-bold text-white mb-2">Login Required</h3>
			<p class="text-gray-400 mb-6 text-sm">You need an account to start trading.</p>
			<a href="/login" class="block w-full py-3 bg-[#00ff9d] text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,157,0.4)]">
				Go to Login
			</a>
		</div>
	</div>
{/if}

<section class="min-h-[80vh] flex flex-col items-center justify-center relative text-center">

	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ff9d]/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

	<div class="space-y-6 max-w-3xl px-4">
		<h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
			Next Gen <br />
			<span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-emerald-600">
     Crypto Trading
    </span>
		</h1>

		<p class="text-gray-400 text-lg md:text-xl">
			Experience the future of decentralized exchange. <br class="hidden md:block" />
			Fast, secure, and purely on-chain liquidity.
		</p>
	</div>

	<div class="mt-10">
		<button
			on:click={handleBigButton}
			class="px-8 py-4 bg-[#00ff9d] hover:bg-[#00ff9d]/90 text-black font-bold rounded-xl shadow-[0_0_30px_rgba(0,255,157,0.4)] transition-all hover:scale-105 cursor-pointer">
			{data.user ? 'Start Trading Now →' : 'Connect Wallet'}
		</button>
	</div>
</section>