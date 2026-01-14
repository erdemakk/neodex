<script lang="ts">
	import { onMount } from 'svelte';

	let coinList = [];
	let mounted = false;
	let searchQuery = "";
	let isLoading = true;

	const fetchMarkets = async () => {
		try {
			const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h');
			const data = await response.json();
			coinList = data;
			isLoading = false;
		} catch (error) {
			console.error(error);
			isLoading = false;
		}
	};

	onMount(() => {
		mounted = true;
		fetchMarkets();
		const interval = setInterval(fetchMarkets, 60000);
		return () => clearInterval(interval);
	});

	$: filteredCoins = coinList.filter(coin =>
		coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(value);
	};

	const formatCompact = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			notation: "compact",
			compactDisplay: "short"
		}).format(value);
	};
</script>

<div class="min-h-screen bg-black text-white px-4 md:px-8 pt-32 pb-20 relative overflow-x-hidden">

	<div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#00ff9d]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

	<div class="max-w-6xl mx-auto">

		<div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
			<div class="min-w-max">
				<h1 class="text-4xl md:text-5xl font-bold tracking-tight uppercase leading-none">
					Market <span class="text-[#00ff9d]">Assets</span>
				</h1>
				<p class="text-white opacity-50 text-[10px] mt-4 uppercase tracking-[0.3em] font-mono">
					Real-time global cryptocurrency metrics
				</p>
			</div>

			<div class="relative w-full md:w-96">
				<span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#00ff9d] text-sm font-bold">❯</span>
				<input
					bind:value={searchQuery}
					placeholder="SEARCH ASSETS..."
					class="w-full bg-white/[0.03] border border-white/10 px-10 py-4 rounded-sm text-xs font-mono focus:outline-none focus:border-[#00ff9d]/50 transition-all uppercase tracking-widest placeholder:text-white/20"
				/>
			</div>
		</div>

		<div class="w-full bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse">
					<thead>
					<tr class="border-b border-white/5 bg-white/[0.02]">
						<th class="p-6 text-[10px] font-bold text-white opacity-40 uppercase tracking-widest">Asset</th>
						<th class="p-6 text-[10px] font-bold text-white opacity-40 uppercase tracking-widest text-right">Price</th>
						<th class="p-6 text-[10px] font-bold text-white opacity-40 uppercase tracking-widest text-right">24h Change</th>
						<th class="p-6 text-[10px] font-bold text-white opacity-40 uppercase tracking-widest text-right hidden md:table-cell">Market Cap</th>
						<th class="p-6 text-[10px] font-bold text-white opacity-40 uppercase tracking-widest text-right hidden lg:table-cell">Volume (24h)</th>
					</tr>
					</thead>
					<tbody>
					{#if isLoading}
						<tr>
							<td colspan="5" class="p-24 text-center">
								<div class="text-[#00ff9d] text-xs font-mono uppercase tracking-[0.5em] animate-pulse">Initializing_Market_Data...</div>
							</td>
						</tr>
					{:else}
						{#each filteredCoins as coin (coin.id)}
							<tr class="border-b border-white/[0.02] hover:bg-[#00ff9d]/[0.02] transition-colors group cursor-default">
								<td class="p-6 text-white font-mono uppercase">
									<div class="flex items-center gap-4">
										<img src={coin.image} alt={coin.name} class="w-7 h-7 transition-transform group-hover:scale-110" />
										<div>
											<div class="text-sm font-bold text-white uppercase tracking-tight">{coin.symbol}</div>
											<div class="text-[10px] text-white opacity-40 uppercase font-medium tracking-tighter">{coin.name}</div>
										</div>
									</div>
								</td>
								<td class="p-6 text-right font-mono text-sm font-bold text-white">
									{formatCurrency(coin.current_price)}
								</td>
								<td class="p-6 text-right font-mono text-sm font-bold">
										<span class={coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
											{coin.price_change_percentage_24h.toFixed(2)}%
										</span>
								</td>
								<td class="p-6 text-right font-mono text-xs text-white opacity-60 hidden md:table-cell uppercase">
									{formatCompact(coin.market_cap)}
								</td>
								<td class="p-6 text-right font-mono text-xs text-white opacity-60 hidden lg:table-cell uppercase">
									{formatCompact(coin.total_volume)}
								</td>
							</tr>
						{/each}

						{#if filteredCoins.length === 0}
							<tr>
								<td colspan="5" class="p-20 text-center text-white/20 font-mono text-xs uppercase tracking-widest">
									No assets found matching "{searchQuery}"
								</td>
							</tr>
						{/if}
					{/if}
					</tbody>
				</table>
			</div>
		</div>

		<div class="mt-12 text-center text-white opacity-20 text-[9px] font-bold uppercase tracking-[0.8em]">
			NeoDEX Market Terminal • {coinList.length} Assets Tracked
		</div>
	</div>
</div>