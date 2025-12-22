<script lang="ts">
	let isMobileMenuOpen = false;

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<header class="w-full bg-black border-b border-gray-800 sticky top-0 z-50">
	<nav class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

		<div class="flex items-center gap-2">
			<div class="w-8 h-8 bg-gradient-to-tr from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
				<span class="text-white font-bold text-lg">N</span>
			</div>
			<a href="/" class="text-xl font-bold text-white tracking-wide">
				NeoDEX
			</a>
		</div>

		<div class="hidden md:flex items-center gap-8">
			<a href="/" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">
				Home
			</a>
			<a href="/markets" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">
				Markets
			</a>
			<a href="/trade" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">
				Trade
			</a>
			<a href="/earn" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">
				Earn
			</a>
			<a href="/community" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">
				Community
			</a>
		</div>

		<div class="hidden md:flex items-center gap-4">
			<a href="/login" class="text-sm font-bold text-white hover:text-gray-300 transition-colors">
				Log In
			</a>
			<a href="/register" class="bg-white text-black px-5 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition-all transform hover:scale-105">
				Sign Up
			</a>
		</div>

		<button
			on:click={toggleMobileMenu}
			type="button"
			class="md:hidden text-gray-300 hover:text-white focus:outline-none"
			aria-label="Toggle mobile menu"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
			</svg>
		</button>

	</nav>

	{#if isMobileMenuOpen}
		<div class="md:hidden bg-gray-900 border-t border-gray-800">
			<div class="flex flex-col px-4 py-4 space-y-4">
				<a href="/" class="text-gray-300 hover:text-white text-sm font-medium">Home</a>
				<a href="/markets" class="text-gray-300 hover:text-white text-sm font-medium">Markets</a>
				<a href="/trade" class="text-gray-300 hover:text-white text-sm font-medium">Trade</a>
				<a href="/earn" class="text-gray-300 hover:text-white text-sm font-medium">Earn</a>
				<a href="/community" class="text-gray-300 hover:text-white text-sm font-medium">Community</a>
				<div class="h-px bg-gray-800 my-2"></div>
				<a href="/login" class="text-gray-300 hover:text-white text-sm font-medium">Log In</a>
				<a href="/register" class="text-white font-bold text-sm">Sign Up</a>
			</div>
		</div>
	{/if}
</header>