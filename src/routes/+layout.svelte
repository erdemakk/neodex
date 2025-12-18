<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	import { wallet } from '$lib/walletStore';
	import { config } from '$lib/wagmi';
	import { connect, disconnect } from '@wagmi/core';
	import { injected } from '@wagmi/connectors';

	export let data;

	// Cüzdan adresi kısaltma (MetaMask'tan gelen)
	$: walletAddressShort = $wallet.address
		? `${$wallet.address.slice(0, 6)}...${$wallet.address.slice(-4)}`
		: '';

	// Veritabanından gelen kullanıcı adı (Login olmuşsa)
	$: dbUserShort = data.user?.username
		? (data.user.username.length > 10 ? `${data.user.username.slice(0, 8)}...` : data.user.username)
		: '';

	const handleConnect = async () => {
		try {
			const result = await connect(config, {
				connector: injected()
			});

			const address = result.accounts[0];

			// Sadece Store'u güncelle, sayfayı yenileme veya api'ye gitme (Sadece cüzdan bağlıyoruz)
			if (address) {
				wallet.set({
					address: address,
					isConnected: true
				});
			}

		} catch (error) {
			console.error('Connection error:', error);
		}
	};

	const handleDisconnectWallet = async () => {
		try {
			await disconnect(config);
			wallet.set({ address: '', isConnected: false });
		} catch (error) {
			console.error('Disconnect error:', error);
		}
	};

	onMount(() => {
		// Eğer kullanıcının DB'de kayıtlı bir adresi varsa onu varsayılan olarak store'a atabiliriz
		// Ancak Wagmi genelde kendi durumunu hatırlar.
		if (data.user && data.user.address) {
			wallet.update(w => ({ ...w, address: data.user.address }));
		}
	});
</script>

<div class="min-h-screen flex flex-col text-white bg-black selection:bg-[#00ff9d] selection:text-black">

	<header class="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
		<div class="w-full flex h-20 items-center justify-between px-4 md:px-8">

			<a href="/" class="group flex items-center gap-3 select-none">
				<div class="relative flex h-10 w-10 items-center justify-center">
					<div class="absolute inset-0 rounded-xl bg-[#00ff9d] blur-md opacity-20 transition-opacity duration-500 group-hover:opacity-100 group-hover:blur-lg"></div>
					<div class="relative flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-black/90 transition-colors duration-300 group-hover:border-[#00ff9d]/50">
						<div class="h-3.5 w-3.5 rounded-sm bg-[#00ff9d] transition-transform duration-500 group-hover:rotate-180 shadow-[0_0_10px_#00ff9d]"></div>
					</div>
				</div>
				<div class="flex flex-col leading-none">
      <span class="text-2xl font-black tracking-tighter text-white">
       Neo<span class="bg-gradient-to-r from-[#00ff9d] via-white to-[#00ff9d] bg-[length:200%_auto] bg-clip-text text-transparent animate-shine">DEX</span>
      </span>
					<span class="text-[0.6rem] font-bold tracking-[0.2em] text-gray-500 group-hover:text-[#00ff9d] transition-colors duration-300">TRADE</span>
				</div>
			</a>

			<nav class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
				<a href="/" class="hover:text-[#00ff9d] transition-colors relative group">
					Trade
					<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff9d] transition-all duration-300 group-hover:w-full"></span>
				</a>
				<a href="/" class="hover:text-[#00ff9d] transition-colors relative group">
					Markets
					<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff9d] transition-all duration-300 group-hover:w-full"></span>
				</a>
				<a href="/" class="hover:text-[#00ff9d] transition-colors relative group">
					Earn
					<span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff9d] transition-all duration-300 group-hover:w-full"></span>
				</a>
			</nav>

			<div class="flex items-center gap-4">

				{#if data.user}
					<div class="hidden md:flex flex-col items-end mr-2 border-r border-white/10 pr-4">
						<span class="text-sm font-bold text-white uppercase tracking-wider">{dbUserShort}</span>
						<div class="flex gap-3 text-xs font-mono opacity-80">
							<span class="text-[#00ff9d]">{data.user.balances?.usdt || '0'} USDT</span>
							<span class="text-purple-400">{data.user.balances?.neo || '0'} NEO</span>
						</div>
					</div>
				{/if}

				{#if $wallet.isConnected}
					<button
						on:click={handleDisconnectWallet}
						class="hidden md:flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-mono text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
						title="Disconnect Wallet">
						<div class="w-2 h-2 rounded-full bg-[#00ff9d] shadow-[0_0_8px_#00ff9d]"></div>
						{walletAddressShort}
					</button>
				{:else}
					<button
						on:click={handleConnect}
						class="hidden md:flex items-center gap-2 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/50 px-4 py-2 text-sm font-bold text-[#00ff9d] transition-all hover:bg-[#00ff9d] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] cursor-pointer">
						<span>Connect Wallet</span>
					</button>
				{/if}

				{#if data.user}
					<form method="POST" action="/?/logout">
						<button type="submit"
										class="text-xs font-bold text-red-400 border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 transition-all px-4 py-2 rounded-lg cursor-pointer h-full">
							Logout
						</button>
					</form>
				{:else}
					<a href="{base}/login" class="text-sm font-medium text-gray-400 hover:text-white transition-colors ml-2">
						Login
					</a>
				{/if}

			</div>
		</div>
	</header>

	<main class="flex-1 container mx-auto p-4">
		<slot />
	</main>
</div>

<style>
    @keyframes shine {
        to {
            background-position: 200% center;
        }
    }
    .animate-shine {
        animation: shine 3s linear infinite;
    }
</style>