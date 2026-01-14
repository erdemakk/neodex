<script lang="ts">
	import { tick } from 'svelte';

	export let closeTerminal: () => void;
	export let messages: Array<{ role: string, content: string }>;
	export let onReset: () => void;

	let userInput = "";
	let isTyping = false;
	let chatContainer: HTMLElement;
	let inputElement: HTMLInputElement;

	const scrollToBottom = async () => {
		await tick();
		if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
	};

	const handleSubmit = async () => {
		if (userInput.trim() === "" || isTyping) return;

		const currentText = userInput;
		messages = [...messages, { role: "user", content: currentText }];
		userInput = "";
		isTyping = true;
		await scrollToBottom();

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages })
			});

			const data = await response.json();

			if (response.ok) {
				const aiText = data.choices[0].message.content;
				messages = [...messages, { role: "assistant", content: aiText }];
			} else {
				messages = [...messages, { role: "assistant", content: "System Error: Data Rejected" }];
			}
		} catch (error) {
			messages = [...messages, { role: "assistant", content: "Critical Error: Link Lost" }];
		} finally {
			isTyping = false;
			await scrollToBottom();
			if (inputElement) inputElement.focus();
		}
	};
</script>

<div class="fixed bottom-6 right-6 w-96 h-[550px] border border-green-900 bg-black shadow-[0_0_40px_rgba(0,255,0,0.2)] rounded-sm flex flex-col overflow-hidden font-mono z-50">

	<div class="bg-green-900/20 p-3 border-b border-green-900 text-[10px] text-green-500 flex justify-between items-center tracking-widest uppercase">
		<div class="flex items-center gap-2">
			<span class="animate-pulse text-green-500 text-xs">●</span>
			<span>NEODEX_CORE_V3</span>
		</div>
		<div class="flex gap-3">
			<button on:click={onReset} class="hover:text-blue-400 transition-colors uppercase" style="cursor: pointer !important;">[RESET]</button>
			<button on:click={closeTerminal} class="hover:text-red-500 transition-colors uppercase" style="cursor: pointer !important;">[ESC]</button>
		</div>
	</div>

	<div bind:this={chatContainer} class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
		{#each messages as msg}
			{#if msg.role !== 'system'}
				<div class="flex flex-col border-l border-green-900/40 pl-3">
          <span class="text-[9px] font-bold tracking-widest uppercase mb-1 {msg.role === 'user' ? 'text-blue-500' : 'text-green-600'}">
            {msg.role === 'user' ? '↳ OPERATOR' : '↳ TRADING_AI'}
          </span>
					<div class="text-[12px] {msg.role === 'user' ? 'text-gray-300' : 'text-green-400'} leading-relaxed whitespace-pre-wrap opacity-90 normal-case" style="text-transform: none !important;">
						{msg.content}
					</div>
				</div>
			{/if}
		{/each}

		{#if isTyping}
			<div class="flex items-center gap-2 text-green-500 text-[10px] italic normal-case">
				<span class="animate-ping">_</span> Processing...
			</div>
		{/if}
	</div>

	<form on:submit|preventDefault={handleSubmit} class="p-3 border-t border-green-900 bg-green-900/5 flex items-center gap-2">
		<span class="text-green-500 font-bold">❯</span>
		<input
			bind:this={inputElement}
			bind:value={userInput}
			placeholder="Enter command..."
			class="bg-transparent border-none outline-none flex-1 text-green-400 placeholder:text-green-900/30 text-[12px] caret-green-500 normal-case"
			style="text-transform: none !important;"
			autocomplete="off"
			disabled={isTyping}
		/>
	</form>
</div>

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
</style>