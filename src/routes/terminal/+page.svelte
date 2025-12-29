<script lang="ts">
	import { tick } from 'svelte';
	import { env } from '$env/dynamic/public';

	let messages: Array<{ role: string, content: string }> = [
		{
			role: "system",
			content: "Sen profesyonel bir kripto trade asistanısın. Sadece Türkçe cevap ver. Teknik analiz, grafik formasyonları ve token ekonomisi konularında uzmansın. Cevaplarını bir terminal ekranına uygun şekilde, maddeler halinde ve teknik bir dille sun. Gereksiz nezaket cümlelerinden kaçın, direkt bilgi ver. Analiz yaparken destek ve direnç noktalarına değin."
		},
		{ role: "assistant", content: "NEODEX_TERMINAL_V3.0 AKTİF. Güvenli bağlantı sağlandı..." }
	];

	let userInput: string = "";
	let isTyping: boolean = false;
	let chatContainer: HTMLElement;

	async function scrollToBottom() {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	async function handleSubmit() {
		if (userInput.trim() === "" || isTyping) return;

		const currentText = userInput;
		messages = [...messages, { role: "user", content: currentText }];
		userInput = "";
		isTyping = true;
		await scrollToBottom();

		try {
			const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${env.VITE_GROQ_API_KEY}`
				},
				body: JSON.stringify({
					model: "llama-3.3-70b-versatile",
					messages: messages
				})
			});

			const data = await response.json();

			if (response.ok) {
				const aiText = data.choices[0].message.content;
				messages = [...messages, { role: "assistant", content: aiText }];
			} else {
				messages = [...messages, { role: "assistant", content: "Sistem Hatası: Veri çekilemedi." }];
			}
		} catch (error) {
			messages = [...messages, { role: "assistant", content: "Bağlantı koptu!" }];
		} finally {
			isTyping = false;
			await scrollToBottom();
		}
	}
</script>

<div class="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
	<div class="w-full max-w-4xl border border-green-900 bg-black shadow-[0_0_40px_rgba(0,255,0,0.1)] rounded-sm flex flex-col h-[750px]">

		<div class="bg-green-900/10 p-3 border-b border-green-900 text-[10px] text-green-500 flex justify-between items-center tracking-widest">
			<div class="flex items-center gap-4">
				<span class="animate-pulse text-red-600 text-xs">●</span>
				<span>NEODEX_CORE_V3</span>
			</div>
			<div class="flex gap-4">
				<span>MEM: ENABLED</span>
				<span>AUTH: ENV_VAULT</span>
			</div>
		</div>

		<div bind:this={chatContainer} class="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/5 via-transparent to-transparent">
			{#each messages as msg}
				{#if msg.role !== 'system'}
					<div class="flex flex-col border-l-2 {msg.role === 'user' ? 'border-blue-900 pl-6' : 'border-green-900 pl-6'}">
                        <span class="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 {msg.role === 'user' ? 'text-blue-500' : 'text-green-600'}">
                            {msg.role === 'user' ? '↳ OPERATOR' : '↳ TRADING_AI'}
                        </span>
						<div class="text-sm {msg.role === 'user' ? 'text-gray-300' : 'text-green-400'} leading-relaxed whitespace-pre-wrap opacity-90">
							{msg.content}
						</div>
					</div>
				{/if}
			{/each}

			{#if isTyping}
				<div class="flex items-center gap-3 text-green-800 text-xs italic">
					<span class="animate-ping">_</span> Veri işleniyor...
				</div>
			{/if}
		</div>

		<form
			on:submit|preventDefault={handleSubmit}
			class="p-5 border-t border-green-900 bg-green-900/5 flex items-center gap-4"
		>
			<span class="text-green-500 font-bold ml-2">❯</span>
			<input
				bind:value={userInput}
				placeholder="Analiz veya komut girin..."
				class="bg-transparent border-none outline-none flex-1 text-green-400 placeholder:text-green-900/30 text-sm caret-green-500"
				autocomplete="off"
				disabled={isTyping}
			/>
		</form>
	</div>
</div>

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }

    :global(body) {
        background-color: black;
        overflow: hidden;
    }
</style>