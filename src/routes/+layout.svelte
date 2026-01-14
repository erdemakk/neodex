<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import { wallet } from '$lib/walletStore';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let isTerminalOpen = false;

	let chatHistory: Array<{ role: string; content: string }> = [
		{
			role: 'system',
			content: 'You are the NEODEX AI Assistant. Act as a helpful guide. Provide technical analysis and platform support. Respond professionally.'
		},
		{ role: 'assistant', content: 'How can I assist your trades today?' }
	];

	async function connectWallet() {
		if (typeof window !== 'undefined' && (window as any).ethereum) {
			try {
				const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
				wallet.set({
					address: accounts[0],
					isConnected: true
				});
			} catch (error) {
				console.error("Bağlantı reddedildi:", error);
			}
		} else {
			alert('MetaMask bulunamadı!');
		}
	}

	const toggleTerminal = () => {
		isTerminalOpen = !isTerminalOpen;
	};

	const resetChat = () => {
		chatHistory = [
			{
				role: 'system',
				content: 'You are the NEODEX AI Assistant. Act as a helpful guide. Provide technical analysis and platform support. Respond professionally.'
			},
			{ role: 'assistant', content: 'Session cleared. Ready for new commands.' }
		];
	};
</script>

<div class="min-h-screen flex flex-col bg-black text-white">
	<Header user={data.user} />

	<main class="min-h-screen flex flex-col bg-black text-white pt-28">
		<slot />
	</main>

	<div class="fixed bottom-6 right-6 z-50 font-mono">
		{#if isTerminalOpen}
			<Terminal
				closeTerminal={toggleTerminal}
				bind:messages={chatHistory}
				onReset={resetChat}
			/>
		{:else}
			<button
				on:click={toggleTerminal}
				class="bg-black border border-green-900 text-green-500 px-6 py-3 rounded-full text-sm shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:bg-green-900/10 transition-all flex items-center gap-2 uppercase tracking-tighter !cursor-pointer"
				style="cursor: pointer !important;"
			>
				<span class="animate-pulse">●</span> ASK_AI
			</button>
		{/if}
	</div>
</div>