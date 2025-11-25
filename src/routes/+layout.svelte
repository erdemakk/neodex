<script lang="ts">
	import "../app.css";
	import type { PageData } from './$types';
	import { base } from '$app/paths';

	export let data: PageData;
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
				<a href="#" class="hover:text-white transition-colors">Trade</a>
				<a href="#" class="hover:text-white transition-colors">Markets</a>
				<a href="#" class="hover:text-white transition-colors">Earn</a>
			</nav>

			<div class="flex items-center gap-3">

				{#if data.user}
					<div class="hidden md:flex flex-col items-end mr-2">
						<span class="text-sm font-bold text-white">{data.user.username}</span>
						<span class="text-xs text-[#00ff9d] font-mono">{data.user.balance} TKN</span>
					</div>

					<form method="POST" action="/?/logout">
						<button type="submit" class="text-sm text-red-400 hover:text-red-300 transition-colors font-medium px-3 py-2 rounded hover:bg-red-500/10">
							Logout
						</button>
					</form>

				{:else}
					<a href="{base}/login" class="text-sm font-medium text-gray-300 hover:text-white transition-colors px-2">
						Login
					</a>

					<a href="{base}/register" class="flex items-center gap-2 rounded-lg bg-[#00ff9d] px-4 py-2 text-sm font-bold text-black transition-all hover:bg-[#00ff9d]/90 hover:shadow-[0_0_10px_rgba(0,255,157,0.3)]">
						Register
					</a>

				{/if}

				<div class="h-6 w-px bg-white/10 mx-1"></div>

				<button class="hidden md:flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-[#00ff9d]/50">
					<span>Connect Wallet</span>
				</button>

			</div>
		</div>
	</header>

	<main class="flex-1 container mx-auto p-4">
		<slot />
	</main>
</div>