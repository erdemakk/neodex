<script lang="ts">
	import { onMount } from 'svelte';

	export let user: { username: string; address?: string } | null = null;

	let isMobileMenuOpen = false;
	let isWalletConnected = false;
	let walletAddress = "";

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	onMount(async () => {
		if (typeof window !== 'undefined' && (window as any).ethereum) {
			(window as any).ethereum.on('accountsChanged', (newAccounts: string[]) => {
				if (newAccounts.length > 0) {
					walletAddress = newAccounts[0];
					isWalletConnected = true;
				} else {
					isWalletConnected = false;
					walletAddress = "";
				}
			});
		}
	});

	async function connectWallet() {
		if (typeof window === 'undefined' || !(window as any).ethereum) {
			alert("MetaMask bulunamadı! Lütfen yükleyin.");
			return;
		}
		try {
			await (window as any).ethereum.request({
				method: 'wallet_requestPermissions',
				params: [{ eth_accounts: {} }]
			});
			const accounts = await (window as any).ethereum.request({
				method: 'eth_requestAccounts'
			});
			walletAddress = accounts[0];
			isWalletConnected = true;
		} catch (error) {
			console.error(error);
		}
	}
</script>

<header class="w-full bg-black border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-black/80">
	<nav class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

		<div class="flex items-center gap-2">
			<div class="w-8 h-8 bg-[#00ff9d]/20 border border-[#00ff9d]/50 rounded-lg flex items-center justify-center">
				<span class="text-[#00ff9d] font-bold text-lg">N</span>
			</div>
			<a href="/" class="text-xl font-bold text-white tracking-wide">
				Neo<span class="text-[#00ff9d]">DEX</span>
			</a>
		</div>

		<div class="hidden md:flex items-center gap-8">
			<a href="/" class="text-sm font-medium text-gray-400 hover:text-[#00ff9d] transition-colors">Home</a>
			<a href="/markets" class="text-sm font-medium text-gray-400 hover:text-[#00ff9d] transition-colors">Markets</a>
			<a href="/trade" class="text-sm font-medium text-gray-400 hover:text-[#00ff9d] transition-colors">Trade</a>
		</div>

		<div class="hidden md:flex items-center gap-1">

			{#if user}
				<div class="flex items-center gap-2 px-3 py-2 bg-[#00ff9d]/5 border border-[#00ff9d]/20 rounded-lg mr-1">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#00ff9d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
					<span class="text-white font-bold text-sm tracking-wide">{user.username}</span>
				</div>

				{#if isWalletConnected}
					<div class="px-4 py-2 bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] rounded-lg text-sm font-mono shadow-[0_0_10px_rgba(0,255,157,0.2)]">
						{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
					</div>
				{:else}
					<button
						type="button"
						on:click={connectWallet}
						class="px-4 py-2 bg-white/5 border border-white/10 hover:border-[#00ff9d] hover:text-[#00ff9d] text-white rounded-lg transition-all text-sm font-bold cursor-pointer">
						Connect Wallet
					</button>
				{/if}

				<form action="/?/logout" method="POST" class="flex items-center m-0 p-0">
					<button type="submit" class="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all cursor-pointer flex items-center justify-center ml-1" title="Logout">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
					</button>
				</form>

			{:else}
				<a href="/login" class="text-sm font-bold text-white hover:text-[#00ff9d] transition-colors mr-4">Log In</a>
				<a href="/register" class="bg-[#00ff9d] text-black px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#00ff9d]/90 transition-all transform hover:scale-105">Sign Up</a>
			{/if}
		</div>

		<button on:click={toggleMobileMenu} type="button" class="md:hidden text-gray-300 hover:text-white focus:outline-none">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
		</button>
	</nav>

	{#if isMobileMenuOpen}
		<div class="md:hidden bg-black border-t border-white/10">
			<div class="flex flex-col px-4 py-4 space-y-4">
				<a href="/" class="text-gray-300 hover:text-[#00ff9d] text-sm font-medium">Home</a>
				<a href="/markets" class="text-gray-300 hover:text-[#00ff9d] text-sm font-medium">Markets</a>
				<a href="/trade" class="text-gray-300 hover:text-[#00ff9d] text-sm font-medium">Trade</a>
				<div class="h-px bg-white/10 my-2"></div>

				{#if user}
					<div class="flex items-center gap-2 text-white font-bold text-sm bg-[#00ff9d]/5 p-2 rounded-lg border border-[#00ff9d]/20 w-fit">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#00ff9d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
						{user.username}
					</div>
					<button on:click={connectWallet} type="button" class="text-[#00ff9d] text-sm font-medium text-left">
						{isWalletConnected ? 'Wallet: ' + walletAddress.slice(0,6) + '...' : 'Connect Wallet'}
					</button>
					<form action="/?/logout" method="POST">
						<button type="submit" class="text-red-400 text-sm font-medium">Log Out</button>
					</form>
				{:else}
					<a href="/login" class="text-gray-300 hover:text-white text-sm font-medium">Log In</a>
					<a href="/register" class="text-[#00ff9d] font-bold text-sm">Sign Up</a>
				{/if}
			</div>
		</div>
	{/if}
</header>