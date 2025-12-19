<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	let connectedAddress: string | null = null;

	onMount(async () => {
		if (typeof window.ethereum !== 'undefined') {
			// 1. Sayfa açılır açılmaz MetaMask'a sor: "Bağlı hesap var mı?"
			const accounts = await window.ethereum.request({ method: 'eth_accounts' });

			if (accounts.length > 0) {
				// Varsa hemen değişkene ata (Buton anında değişir)
				connectedAddress = accounts[0];

				// Eğer sunucu bizi tanımıyorsa (Cookie yoksa), arka planda tekrar giriş yap
				if (!data.user) {
					await loginToBackend(connectedAddress);
				}
			}

			// Hesap değişirse yakala
			window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
				if (newAccounts.length > 0) {
					connectedAddress = newAccounts[0];
					loginToBackend(newAccounts[0]);
				} else {
					connectedAddress = null;
					window.location.reload();
				}
			});
		}
	});

	async function loginToBackend(address: string) {
		try {
			await fetch('/api/login', {
				method: 'POST',
				body: JSON.stringify({ address }),
				headers: { 'Content-Type': 'application/json' }
			});
			await invalidateAll(); // Sunucu verisini tazelet
		} catch (e) {
			console.error("Login hatası:", e);
		}
	}

	async function connectWallet() {
		if (typeof window.ethereum === 'undefined') return alert("MetaMask yok!");
		try {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			connectedAddress = accounts[0];
			await loginToBackend(accounts[0]);
		} catch (e) { console.error(e); }
	}
</script>

<div class="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 relative">
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ff9d]/5 blur-[100px] rounded-full pointer-events-none"></div>

	<div class="relative z-10 space-y-6 max-w-3xl">
		<h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
			Next Gen <br />
			<span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-emerald-500">Crypto Trading</span>
		</h1>
	</div>

	{#if data.user || connectedAddress}
		<div class="pt-8 animate-fade-in flex flex-col items-center gap-4 relative z-20">
			<a href="/trade" class="px-10 py-4 rounded-xl bg-gradient-to-r from-[#00ff9d] to-emerald-500 text-black font-bold text-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,157,0.3)] flex items-center gap-2">
				Swap Now
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
			</a>
			<span class="text-xs text-gray-500 font-mono">
        Connected:
				{#if data.user?.address}
            {data.user.address.slice(0,6)}...{data.user.address.slice(-4)}
        {:else if connectedAddress}
            {connectedAddress.slice(0,6)}...{connectedAddress.slice(-4)}
        {/if}
    </span>
		</div>
	{:else}
		<div class="pt-8 animate-fade-in relative z-20">
			<button on:click={connectWallet} class="px-8 py-4 rounded-xl border-2 border-[#00ff9d] text-[#00ff9d] font-bold text-lg hover:bg-[#00ff9d]/10 transition-all cursor-pointer">
				Connect Wallet
			</button>
		</div>
	{/if}
</div>