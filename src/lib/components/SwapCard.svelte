<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	export let data;

	let swapForm: HTMLFormElement;
	let payAmount: number = 0;
	let isProcessing = false;
	let clientAddress = '';

	let payIndex = 0;
	let receiveIndex = 8;
	let isRotated = false;

	onMount(async () => {
		if (typeof window !== 'undefined' && (window as any).ethereum) {
			const eth = (window as any).ethereum;
			try {
				const accounts = await eth.request({ method: 'eth_accounts' });
				if (accounts.length > 0) clientAddress = accounts[0];

				eth.on('accountsChanged', (newAccounts: string[]) => {
					if (newAccounts.length > 0) {
						clientAddress = newAccounts[0];
					} else {
						clientAddress = '';
					}
				});
			} catch (err) {
				console.error(err);
			}
		}
	});

	$: user = $page.data.user;

	$: activeAddress = user ? (clientAddress || user.address) : '';
	$: isConnected = !!user && !!activeAddress;

	$: displayAddress = activeAddress
		? activeAddress.slice(0, 6) + '...' + activeAddress.slice(-4)
		: 'Not Connected';

	$: tokens = data.tokens || [];
	$: payToken = tokens[payIndex] || { symbol: 'ETH', price: 0 };
	$: receiveToken = tokens[receiveIndex] || { symbol: 'USDT', price: 1 };

	$: dbBalance = user?.balances?.[payToken.symbol] || 0;
	$: payBalance = (payToken.symbol === 'ETH' && dbBalance === 0) ? 10.00 : dbBalance;

	$: exchangeRate = receiveToken.price > 0 ? (payToken.price / receiveToken.price) : 0;
	$: receiveAmount = payAmount * exchangeRate;

	const swapPositions = () => {
		isRotated = !isRotated;
		const tempIndex = payIndex;
		payIndex = receiveIndex;
		receiveIndex = tempIndex;
		payAmount = 0;
	};

	const setMax = () => {
		if (payBalance > 0) payAmount = payBalance;
	};

	const handleSwap = async () => {
		if (!user) {
			return alert("Please Login First to Trade");
		}

		const eth = (window as any).ethereum;

		if (!clientAddress && eth) {
			try {
				const accounts = await eth.request({ method: 'eth_requestAccounts' });
				clientAddress = accounts[0];
			} catch (e) {
				return alert("Wallet connection failed");
			}
		}

		if (!isConnected && !clientAddress) return alert("Connect Wallet Failed");

		try {
			isProcessing = true;
			const message = `SWAP REQUEST\n\nSell: ${payAmount} ${payToken.symbol}\nBuy: ${receiveAmount.toFixed(4)} ${receiveToken.symbol}`;

			await eth.request({
				method: 'personal_sign',
				params: [message, clientAddress || activeAddress],
			});

			if (swapForm) setTimeout(() => swapForm.requestSubmit(), 100);

		} catch (err) {
			console.error(err);
			isProcessing = false;
		}
	};
</script>

<div class="max-w-[420px] mx-auto bg-[#0d0d0d] border border-white/10 rounded-[24px] p-5 shadow-2xl mt-8 relative z-10">
	<div class="flex justify-between items-center mb-6 px-1">
		<span class="text-white font-semibold text-lg tracking-wide">Swap</span>

		<span class="text-[11px] font-mono px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-colors
		{isConnected ? 'bg-[#00ff9d]/10 border-[#00ff9d]/20 text-[#00ff9d]' : 'bg-red-500/10 border-red-500/20 text-red-400'}">
			<div class="w-2 h-2 rounded-full {isConnected ? 'bg-[#00ff9d] animate-pulse' : 'bg-red-500'}"></div>
			{displayAddress}
		</span>
	</div>

	<form
		bind:this={swapForm}
		method="POST"
		action="?/confirmSwap"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					await invalidateAll();
					alert(`Swap Successful!`);
					payAmount = 0;
				} else {
					alert('Server Error: ' + (result.data?.message || 'Failed'));
				}
				isProcessing = false;
			};
		}}
	>
		<input type="hidden" name="amount" value={payAmount} />
		<input type="hidden" name="paySymbol" value={payToken.symbol} />
		<input type="hidden" name="receiveSymbol" value={receiveToken.symbol} />
		<input type="hidden" name="receiveAmount" value={receiveAmount} />

		<div class="space-y-3 relative">
			<div class="bg-[#1a1a1a] rounded-2xl p-4 border border-transparent hover:border-[#00ff9d]/30 transition-all z-10 relative">
				<div class="flex justify-between text-[11px] text-gray-500 mb-2 font-medium">
					<span>You pay</span>
					<span>Balance: <span class="text-white">{user ? payBalance.toFixed(4) : '0.0000'} {payToken.symbol}</span></span>
				</div>

				<div class="flex items-center gap-3">
					<input type="number" step="any" bind:value={payAmount} placeholder="0" class="bg-transparent text-3xl text-white outline-none w-full font-bold placeholder-gray-700" />
					<button type="button" on:click={setMax} class="text-[10px] bg-[#00ff9d]/10 text-[#00ff9d] px-2.5 py-1 rounded-md font-bold hover:bg-[#00ff9d]/20 transition-colors">MAX</button>

					<select bind:value={payIndex} class="bg-[#222] text-white text-sm border-none outline-none font-bold p-2 px-3 rounded-xl cursor-pointer hover:bg-[#2a2a2a] min-w-[110px]">
						{#each tokens as token, i}
							<option value={i} disabled={i === receiveIndex}>{token.symbol}</option>
						{/each}
					</select>
				</div>

				<div class="text-[10px] text-gray-500 mt-1">${payToken.price.toLocaleString()}</div>
			</div>

			<div class="relative z-20 -my-5 flex justify-center pointer-events-none">
				<button type="button" on:click={swapPositions} class="pointer-events-auto bg-[#0d0d0d] border-[4px] border-[#0d0d0d] rounded-xl p-2 text-[#00ff9d] shadow-lg transition-all duration-300 cursor-pointer {isRotated ? 'rotate-180 hover:rotate-0' : 'rotate-0 hover:rotate-180'}">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
					</svg>
				</button>
			</div>

			<div class="bg-[#1a1a1a] rounded-2xl p-4 border border-transparent z-10 relative">
				<div class="flex justify-between text-[11px] text-gray-500 mb-2 font-medium">
					<span>You receive</span>
					<span>1 {payToken.symbol} ≈ {exchangeRate.toFixed(4)} {receiveToken.symbol}</span>
				</div>

				<div class="flex items-center gap-3">
					<input type="number" value={receiveAmount.toFixed(6)} readonly class="bg-transparent text-3xl text-white/60 outline-none w-full font-bold cursor-default" />

					<select bind:value={receiveIndex} class="bg-[#222] text-white text-sm border-none outline-none font-bold p-2 px-3 rounded-xl cursor-pointer hover:bg-[#2a2a2a] min-w-[110px]">
						{#each tokens as token, i}
							<option value={i} disabled={i === payIndex}>{token.symbol}</option>
						{/each}
					</select>
				</div>

				<div class="text-[10px] text-gray-500 mt-1">${receiveToken.price.toLocaleString()}</div>
			</div>
		</div>

		<button
			type="button"
			on:click={handleSwap}
			disabled={isProcessing || payAmount <= 0}
			class="w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed
			{isConnected ? 'bg-[#00ff9d] text-black' : 'bg-gray-800 text-gray-400'}"
		>
			{#if isProcessing}
				Processing...
			{:else if !user}
				Please Login First
			{:else if !isConnected}
				Connect Wallet
			{:else if payAmount > payBalance}
				Insufficient {payToken.symbol} Balance
			{:else}
				Confirm Swap
			{/if}
		</button>
	</form>
</div>
