<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import { base } from '$app/paths';

	import { wallet } from '$lib/walletStore';
	import { config } from '$lib/wagmi';
	import { connect, disconnect } from '@wagmi/core';
	import { injected } from '@wagmi/connectors';

	export let data;

	$: shortAddress = $wallet.address
		? `${$wallet.address.slice(0, 6)}...${$wallet.address.slice(-4)}`
		: '';

	const handleConnect = async () => {
		try {
			const result = await connect(config, {
				connector: injected()
			});

			const address = result.accounts[0];

			if (address) {
				const response = await fetch('/api/login', {
					method: 'POST',
					body: JSON.stringify({ address }),
					headers: { 'Content-Type': 'application/json' }
				});

				const resData = await response.json();

				if (resData.success) {
					wallet.set({
						address: address,
						isConnected: true
					});
					window.location.reload();
				}
			}

		} catch (error) {
			console.error("Connection error:", error);
		}
	};

	const handleDisconnect = async () => {
		try {
			await disconnect(config);
			wallet.set({ address: "", isConnected: false });
		} catch (error) {
			console.error("Disconnect error:", error);
		}
	};

	onMount(() => {
		if (data.user) {
			wallet.set({
				address: data.user.address,
				isConnected: true
			});
		}
	});
</script>

<div class="min-h-screen flex flex-col text-white">

	<header class="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
		<div class="w-full flex h-16 items-center justify-between px-4 md:px-8">

			<a href="/" class="flex items-center gap-2 group">
				<div class="relative flex h-8 w-8 items-center justify-center rounded bg-white/5 border border-white/10 group-hover:border-[#00ff9d]/50 group-hover:shadow-[0_0_15px_rgba(0,255,157,0.3)] transition-all duration-300">
					<div class="h-3 w-3 rounded-sm bg-[#00ff9d] rotate-45"></div>
				</div>
				<span class="text-lg font-bold tracking-tight">
          Neo<span class="text-[#00ff9d]">DEX</span>
        </span>
			</a>

			<nav class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
				<a href="/" class="hover:text-white transition-colors">Trade</a>
				<a href="/" class="hover:text-white transition-colors">Markets</a>
				<a href="/" class="hover:text-white transition-colors">Earn</a>
			</nav>

			<div class="flex items-center gap-3">

				{#if data.user}
					<div class="hidden md:flex flex-col items-end mr-2">
						<span class="text-sm font-bold text-white uppercase">{shortAddress}</span>
						<div class="flex gap-2 text-xs">
							<span class="text-[#00ff9d] font-mono">{data.user.balances?.usdt} USDT</span>
							<span class="text-purple-400 font-mono">{data.user.balances?.neo} NEO</span>
						</div>
					</div>

					<form method="POST" action="/?/logout" on:submit={handleDisconnect}>
						<button type="submit" class="text-sm text-red-400 hover:text-red-300 transition-colors font-medium px-3 py-2 rounded hover:bg-red-500/10 cursor-pointer">
							Logout
						</button>
					</form>

				{:else}
					<a href="{base}/login" class="text-sm font-medium text-gray-300 hover:text-white transition-colors px-2">
						Login
					</a>

					<div class="h-6 w-px bg-white/10 mx-1"></div>

					<button
						on:click={handleConnect}
						class="hidden md:flex items-center gap-2 rounded-lg bg-[#00ff9d] px-4 py-2 text-sm font-bold text-black transition-all hover:bg-[#00ff9d]/90 hover:shadow-[0_0_10px_rgba(0,255,157,0.3)] cursor-pointer">
						<span>Connect Wallet</span>
					</button>

				{/if}

			</div>
		</div>
	</header>

	<main class="flex-1 container mx-auto p-4">
		<slot />
	</main>
</div>