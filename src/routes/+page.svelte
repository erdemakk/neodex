<script lang="ts">
	export let data;

	let isWalletConnected = false;
	let walletAddress = "";
	let showLoginModal = false;

	async function handleConnectWallet() {
		if (!data.user) {
			showLoginModal = true;
			return;
		}

		if (typeof window !== 'undefined' && (window as any).ethereum) {
			try {
				const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
				walletAddress = accounts[0];
				isWalletConnected = true;
			} catch (error) {
				console.error("User denied account access");
			}
		} else {
			alert("MetaMask is not installed!");
		}
	}
</script>

{#if showLoginModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
		<div class="bg-[#111] border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl relative">

			<button on:click={() => showLoginModal = false} class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
				✕
			</button>

			<div class="w-16 h-16 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
				🔒
			</div>

			<h3 class="text-xl font-bold text-white mb-2">Login Required</h3>
			<p class="text-gray-400 mb-6 text-sm">
				You need to log in to your account before connecting your wallet.
			</p>

			<div class="space-y-3">
				<a href="/login" class="block w-full py-3 bg-[#00ff9d] text-black font-bold rounded-xl hover:scale-[1.02] transition-transform">
					Go to Login
				</a>
				<button on:click={() => showLoginModal = false} class="block w-full py-3 bg-white/5 text-gray-300 font-bold rounded-xl hover:bg-white/10 transition-colors">
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}

<section class="min-h-[80vh] flex flex-col items-center justify-center relative text-center">

	{#if data.user}
		<div class="absolute top-0 right-4 flex items-center gap-4">
			<span class="text-gray-400 text-sm hidden md:block">Welcome, <span class="text-white">{data.user.username}</span></span>
			<form action="?/logout" method="POST">
				<button type="submit" class="text-xs text-red-400 border border-red-400/30 px-3 py-1 rounded hover:bg-red-400/10 transition-colors">
					Logout
				</button>
			</form>
		</div>
	{/if}

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
				<span class="text-xs text-green-500 font-mono bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
			</div>

		{:else}
			<button on:click={handleConnectWallet} class="px-8 py-4 border-2 border-green-500 text-green-500 font-bold rounded-xl hover:bg-green-500/10 transition-all cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.1)]">
				Connect Wallet
			</button>
		{/if}
	</div>
</section>