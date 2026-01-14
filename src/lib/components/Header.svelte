<script lang="ts">
	import { page } from '$app/stores';
	import { wallet } from '$lib/walletStore';
	import { onMount } from 'svelte';

	$: user = $page.data.user;
	$: balances = user?.balances || {};

	$: myAssets = Object.entries(balances)
		.filter(([_, amount]) => Number(amount) > 0)
		.sort((a, b) => Number(b[1]) - Number(a[1]));

	$: ethBalance = balances.ETH || 0;

	let showWalletMenu = false;

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 4
		}).format(num);
	};

	async function connectWallet() {
		if (typeof window !== 'undefined' && (window as any).ethereum) {
			try {
				const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
				wallet.set({
					address: accounts[0],
					isConnected: true
				});
			} catch (error) {
				console.error(error);
			}
		} else {
			alert('MetaMask not found');
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined' && (window as any).ethereum) {

			(window as any).ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
				if (accounts.length > 0) {
					wallet.set({
						address: accounts[0],
						isConnected: true
					});
				}
			});

			(window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
				if (accounts.length === 0) {
					wallet.set({
						address: '',
						isConnected: false
					});
				} else {
					wallet.set({
						address: accounts[0],
						isConnected: true
					});
				}
			});
		}
	});
</script>

<header class="w-full bg-black/80 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
	<nav class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

		<div class="flex items-center gap-3">
			<div class="w-7 h-7 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded flex items-center justify-center">
				<span class="text-[#00ff9d] font-bold text-sm">N</span>
			</div>
			<a href="/" class="text-lg font-bold text-white tracking-tight hover:opacity-80 transition-opacity">
				Neo<span class="text-[#00ff9d]">DEX</span>
			</a>
		</div>

		<div class="flex items-center gap-6">
			<a href="/" class="text-[13px] font-medium text-gray-400 hover:text-[#00ff9d] transition-colors">HOME</a>
			<a href="/markets" class="text-[13px] font-medium text-gray-400 hover:text-[#00ff9d] transition-colors">MARKETS</a>
			<a href="/swap" class="text-[13px] font-medium text-gray-400 hover:text-[#00ff9d] transition-colors">TRADE</a>
		</div>

		<div class="flex items-center gap-4">
			{#if user}
				<div
					role="button"
					tabindex="0"
					class="relative flex items-center gap-3 cursor-pointer group h-16"
					on:mouseenter={() => showWalletMenu = true}
					on:mouseleave={() => showWalletMenu = false}
				>
					<div class="text-right">
						<div class="text-[9px] text-gray-500 uppercase tracking-tighter group-hover:text-[#00ff9d] transition-colors">BALANCE</div>
						<div class="text-white font-bold text-xs font-mono">{formatNumber(ethBalance)} ETH</div>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-gray-500 group-hover:text-[#00ff9d] transition-transform group-hover:rotate-180 duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>

					{#if showWalletMenu}
						<div class="absolute top-full right-0 w-56 bg-[#0d0d0d] border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden ring-1 ring-white/5 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default">
							<div class="px-4 py-2 border-b border-white/5 bg-white/5 flex justify-between items-center text-[10px] font-bold text-gray-400">
								<span>PORTFOLIO</span>
								<span class="text-[#00ff9d] animate-pulse">LIVE</span>
							</div>
							<div class="max-h-60 overflow-y-auto p-1 space-y-1 custom-scrollbar">
								{#each myAssets as [symbol, amount] (symbol)}
									<div class="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-all text-xs group/item">
										<span class="text-gray-300 font-bold uppercase group-hover/item:text-white">{symbol}</span>
										<span class="text-[#00ff9d] font-mono">{formatNumber(Number(amount))}</span>
									</div>
								{/each}
								{#if myAssets.length === 0}
									<div class="text-center py-4 text-[10px] text-gray-600">No assets found</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>

				<div class="h-6 w-[1px] bg-white/10 mx-1"></div>

				{#if $wallet.isConnected}
					<div class="flex items-center gap-2 px-2 py-1 bg-[#1a1a1a] border border-green-500/30 rounded cursor-default">
						<div class="w-1.5 h-1.5 rounded-full bg-[#00ff9d] shadow-[0_0_5px_#00ff9d]"></div>
						<span class="text-[#00ff9d] font-mono text-[10px] tracking-wide">
        {$wallet.address.slice(0, 6)}...{$wallet.address.slice(-4)}
       </span>
					</div>
				{:else}
					<button
						on:click={connectWallet}
						class="flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] border border-white/10 rounded hover:border-[#00ff9d]/50 hover:bg-[#00ff9d]/10 transition-all cursor-pointer group"
					>
						<div class="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-[#00ff9d] transition-colors"></div>
						<span class="text-gray-300 group-hover:text-white font-bold text-[10px] tracking-wide uppercase">Connect</span>
					</button>
				{/if}

				<div class="flex items-center gap-2 px-2 py-1 bg-[#1a1a1a] border border-white/5 rounded hover:border-white/20 transition-colors">
					<span class="text-gray-300 font-bold text-[11px] tracking-wide uppercase">{user.username}</span>
				</div>

				<form action="/?/logout" method="POST">
					<button type="submit" class="p-1.5 text-gray-500 hover:text-red-400 cursor-pointer transition-colors" title="Logout">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
					</button>
				</form>
			{:else}
				<a href="/login" class="text-xs font-bold text-white hover:text-[#00ff9d] transition-colors">LOGIN</a>
				<a href="/register" class="bg-[#00ff9d] text-black px-4 py-1.5 rounded text-xs font-bold hover:bg-[#00ff9d]/90 hover:scale-105 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,157,0.3)]">JOIN NOW</a>
			{/if}
		</div>
	</nav>
</header>