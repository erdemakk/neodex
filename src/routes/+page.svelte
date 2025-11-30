<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 relative">

	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ff9d]/5 blur-[100px] rounded-full pointer-events-none"></div>

	<div class="relative z-10 space-y-6 max-w-3xl">
		<h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
			Next Gen <br />
			<span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-emerald-500">
        Crypto Trading
      </span>
		</h1>

		<p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
			Experience lightning-fast swaps, deep liquidity, and community-driven governance on <span class="text-white font-semibold">NeoDEX</span>.
		</p>
	</div>

	{#if data.user}
		<div class="pt-8 animate-fade-in">
			<button class="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer">
				Start Trading Now
			</button>
		</div>
	{/if}

</div>