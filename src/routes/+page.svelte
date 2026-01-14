<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import 'keen-slider/keen-slider.min.css';
	import KeenSlider from 'keen-slider';

	export let data;

	let showLoginModal = false;
	let mounted = false;
	let coinData = [];
	let topPools = [];
	let sliderElement: HTMLElement;
	let sliderInstance: any;
	let updateInterval: any;

	const fetchMarketData = async () => {
		try {
			const [coinRes, poolRes] = await Promise.all([
				fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false'),
				fetch('https://api.geckoterminal.com/api/v2/networks/eth/trending_pools')
			]);

			const coinJson = await coinRes.json();
			const poolJson = await poolRes.json();

			coinData = coinJson;
			topPools = poolJson.data.slice(0, 5).map(pool => ({
				pair: pool.attributes.name,
				liquidity: `$${(Number(pool.attributes.reserve_in_usd) / 1000000).toFixed(1)}M`,
				volume: `$${(Number(pool.attributes.volume_usd.h24) / 1000000).toFixed(1)}M`,
				apr: `${(Math.random() * 20 + 5).toFixed(1)}%`
			}));
		} catch (error) {
			console.error(error);
		}
	};

	const animation = { duration: 60000, easing: (t: number) => t };

	onMount(async () => {
		mounted = true;
		await fetchMarketData();

		if (sliderElement && coinData.length > 0) {
			sliderInstance = new KeenSlider(sliderElement, {
				loop: true,
				renderMode: "performance",
				drag: false,
				slides: { perView: "auto", spacing: 0 },
				created(s) { s.moveToIdx(5, true, animation); },
				updated(s) { s.moveToIdx(s.track.details.abs + 5, true, animation); },
				animationEnded(s) { s.moveToIdx(s.track.details.abs + 5, true, animation); },
			});
		}

		updateInterval = setInterval(fetchMarketData, 300000);
	});

	onDestroy(() => {
		if (updateInterval) clearInterval(updateInterval);
		if (sliderInstance) sliderInstance.destroy();
	});

	const handleBigButton = async () => {
		if (data.user) { await goto('/swap'); } else { showLoginModal = true; }
	};

	const closeModal = () => { showLoginModal = false; };
</script>

{#if showLoginModal}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm" transition:fade>
		<div class="bg-black border border-[#00ff9d]/30 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,255,157,0.15)] relative font-mono text-white">
			<button on:click={closeModal} class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-xl cursor-pointer">✕</button>
			<div class="text-6xl mb-4 text-[#00ff9d]">!</div>
			<h3 class="text-xl font-bold mb-2 uppercase tracking-tighter">Access Denied</h3>
			<p class="mb-6 text-xs uppercase leading-relaxed opacity-80">Authentication required to initialize terminal.</p>
			<a href="/login" class="block w-full py-3 bg-[#00ff9d] text-black font-bold rounded-sm hover:scale-[1.02] transition-transform uppercase text-xs tracking-widest text-center">Login Protocol</a>
		</div>
	</div>
{/if}

<div class="w-full bg-black border-b border-white/5 py-3 sticky top-[80px] z-40 backdrop-blur-md -mt-28">
	<div bind:this={sliderElement} class="keen-slider flex items-center">
		{#if coinData.length > 0}
			{#each coinData as coin}
				<div class="keen-slider__slide flex items-center gap-4 px-10 border-r border-white/5 min-w-max">
					<div class="relative flex items-center justify-center">
						<div class="absolute inset-0 bg-white/5 blur-md rounded-full scale-150"></div>
						<img src={coin.image} alt={coin.name} class="w-5 h-5 relative z-10" />
					</div>
					<span class="text-white text-[11px] font-bold uppercase tracking-widest font-mono">{coin.symbol}</span>
					<span class="text-[#00ff9d] text-[11px] font-bold font-mono">${coin.current_price.toLocaleString()}</span>
					<span class="text-[10px] font-mono {coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}">{coin.price_change_percentage_24h.toFixed(2)}%</span>
				</div>
			{/each}
		{:else}
			<div class="px-10 text-green-900 text-[10px] uppercase tracking-[0.5em] font-mono animate-pulse">Syncing_Market_Data...</div>
		{/if}
	</div>
</div>

<div class="flex flex-col items-center relative px-4">
	<div class="absolute top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff9d]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

	{#if mounted}
		<div in:fly={{ y: 20, duration: 1000 }} class="text-center space-y-6 mt-20">
			<div class="inline-block px-4 py-1 border border-[#00ff9d]/20 rounded-sm bg-[#00ff9d]/5 text-[9px] text-[#00ff9d] font-bold tracking-[0.4em] uppercase mx-auto block w-fit">Network Status: Operational</div>
			<h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">Next Gen <br /><span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] via-[#00cc7a] to-emerald-600">Crypto Trading</span></h1>
			<p class="text-white text-sm md:text-lg max-w-xl mx-auto opacity-90 font-medium text-center">Experience the future of decentralized exchange. <br class="hidden md:block" />Fast, secure, and purely on-chain liquidity.</p>
			<div class="pt-4"><button on:click={handleBigButton} class="px-10 py-4 bg-[#00ff9d] hover:bg-white text-black font-black rounded-sm shadow-[0_0_50px_rgba(0,255,157,0.2)] transition-all hover:scale-105 cursor-pointer uppercase tracking-[0.2em] text-xs">Start Trading Now →</button></div>
		</div>
	{/if}

	<div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-5xl border-y border-white/5 py-10">
		{#each [{ label: '24h Volume', val: '$8.4B' }, { label: 'Active Users', val: '412K+' }, { label: 'Liquidity', val: '$1.2B' }, { label: 'Uptime', val: '99.99%' }] as stat}
			<div class="text-center space-y-1">
				<div class="text-2xl font-bold text-white font-mono">{stat.val}</div>
				<div class="text-[9px] text-white uppercase tracking-widest font-bold opacity-60">{stat.label}</div>
			</div>
		{/each}
	</div>

	<div class="w-full max-w-4xl mt-20 bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
		<div class="flex justify-between items-end mb-6">
			<div>
				<h3 class="text-white font-bold text-lg tracking-tight uppercase">Top Liquidity Pools</h3>
				<p class="text-white/40 text-[10px] uppercase tracking-widest mt-1">Real-time protocol depth across pairs</p>
			</div>
			<a href="/swap" class="text-[#00ff9d] text-[10px] font-bold uppercase tracking-widest hover:underline transition-all">Add Liquidity +</a>
		</div>

		<div class="space-y-3">
			{#if topPools.length > 0}
				{#each topPools as pool}
					<div class="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-lg hover:border-[#00ff9d]/30 transition-all cursor-default group">
						<div class="flex items-center gap-4">
							<div class="text-white font-bold text-sm font-mono tracking-tighter">{pool.pair}</div>
							<div class="text-[10px] bg-[#00ff9d]/10 text-[#00ff9d] px-2 py-0.5 rounded font-bold">{pool.apr} APR</div>
						</div>
						<div class="flex gap-10">
							<div class="text-right">
								<div class="text-[9px] text-white/30 uppercase font-bold tracking-tighter">TVL</div>
								<div class="text-white text-xs font-mono">{pool.liquidity}</div>
							</div>
							<div class="text-right hidden md:block">
								<div class="text-[9px] text-white/30 uppercase font-bold tracking-tighter">24h Vol</div>
								<div class="text-white text-xs font-mono">{pool.volume}</div>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="text-center py-10 text-white/20 text-xs uppercase tracking-widest animate-pulse">Fetching Protocol Liquidity...</div>
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-20 max-w-6xl w-full">
		{#each [{ icon: '⚡', title: 'Low Latency', desc: 'Smart order routing through decentralized liquidity pools.' }, { icon: '🛡️', title: 'Self-Custody', desc: 'You maintain 100% control of your assets at all times.' }, { icon: '📊', title: 'Pro Analytics', desc: 'Advanced trading tools for comprehensive market analysis.' }] as card}
			<div class="bg-white/[0.01] border border-white/5 p-8 rounded-sm hover:border-[#00ff9d]/30 transition-all duration-500 text-center">
				<div class="text-[#00ff9d] mb-6 text-2xl mx-auto w-fit">{card.icon}</div>
				<h4 class="text-white font-bold mb-3 uppercase text-xs tracking-[0.2em]">{card.title}</h4>
				<p class="text-white text-[10px] leading-relaxed tracking-wide opacity-70 font-medium italic text-center">{card.desc}</p>
			</div>
		{/each}
	</div>

	<div class="pb-10 text-white/20 text-[9px] tracking-[0.8em] uppercase font-bold text-center">NeoDEX Protocol • Decoupled Exchange Engine</div>
</div>

<style>
    :global(body) { overflow-x: hidden; background-color: black; }
    :global(.keen-slider) { display: flex; overflow: hidden; }
    :global(.keen-slider__slide) { min-width: max-content !important; }
    :global(::-webkit-scrollbar) { width: 4px; }
    :global(::-webkit-scrollbar-track) { background: transparent; }
    :global(::-webkit-scrollbar-thumb) { background: #111; }
</style>