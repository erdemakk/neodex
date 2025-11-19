<script lang="ts">
	import "../app.css";
</script>

<div class="min-h-screen flex flex-col text-white">
	<header class="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<a href="/" class="flex items-center gap-2 group">
				<div class="relative flex h-8 w-8 items-center justify-center rounded bg-white/5 border border-white/10 group-hover:border-[#00ff9d]/50 group-hover:shadow-[0_0_15px_rgba(0,255,157,0.3)] transition-all duration-300">
					<div class="h-3 w-3 rounded-sm bg-[#00ff9d] rotate-45"></div>
				</div>
				<span class="text-lg font-bold tracking-tight">
          Fractal<span class="text-[#00ff9d]">DEX</span>
        </span>
			</a>

			<nav class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
				<a href="#" class="text-white hover:text-[#00ff9d] transition-colors">Trade</a>
				<a href="#" class="hover:text-white transition-colors">Markets</a>
				<a href="#" class="hover:text-white transition-colors">Earn</a>
			</nav>

			<div class="flex items-center gap-4">
				<button class="hidden md:flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-[#00ff9d]/50 hover:shadow-[0_0_10px_rgba(0,255,157,0.1)]">
					<span>Connect Wallet</span>
				</button>
			</div>
		</div>
	</header>

	<main class="flex-1 container mx-auto p-4">
		<slot />
	</main>
</div>