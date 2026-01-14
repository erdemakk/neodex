<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { db } from '$lib/firebase';
	import {
		ref,
		push,
		onChildAdded,
		query,
		limitToLast,
		serverTimestamp,
		type DatabaseReference
	} from 'firebase/database';

	export let data;

	type MongoUser = {
		_id: string;
		username: string;
		address: string;
		email?: string;
	};

	type ChatMessage = {
		senderId: string;
		username: string;
		text: string;
		ts?: number;
	};

	let message = '';
	let messages: Array<{ key: string; data: ChatMessage }> = [];
	let messagesRef: DatabaseReference | null = null;
	let chatContainer: HTMLDivElement;

	let showMentions = false;
	let mentionFilter = '';
	let selectedIndex = 0;

	let unreadCount = 0;
	let hasPendingMention = false;
	let isPageLoaded = false;
	let isUserAtBottom = true;

	$: currentUser = data.user as MongoUser | null;
	$: uniqueUsers = data.allUsers || [];
	$: filteredUsers = uniqueUsers.filter((u: string) => u && u.toLowerCase().includes(mentionFilter));

	onMount(() => {
		messagesRef = ref(db, 'public-chat/messages');
		const q = query(messagesRef, limitToLast(200));

		setTimeout(() => {
			isPageLoaded = true;
			scrollToBottom();
		}, 1000);

		onChildAdded(q, async (snapshot) => {
			const val = snapshot.val();
			const newMessage = {
				key: snapshot.key as string,
				data: {
					senderId: val.senderId ?? 'unknown',
					username: val.username ?? 'Anonymous',
					text: val.text ?? '',
					ts: val.ts ?? Date.now()
				}
			};

			let wasAtBottom = false;
			if (chatContainer) {
				wasAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight <= 50;
			}

			messages = [...messages, newMessage];
			await tick();

			if (!isPageLoaded) {
				scrollToBottom();
			} else {
				const isMyMessage = currentUser && val.username === currentUser.username;

				if (isMyMessage) {
					scrollToBottom();
				} else if (wasAtBottom) {
					scrollToBottom();
				} else {
					unreadCount += 1;
					isUserAtBottom = false;

					if (val.text.includes(`@${currentUser?.username}`)) {
						hasPendingMention = true;
					}
				}
			}
		});
	});

	const handleScroll = () => {
		if (!chatContainer) return;
		const atBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight <= 50;

		isUserAtBottom = atBottom;

		if (atBottom) {
			unreadCount = 0;
			hasPendingMention = false;
		}
	};

	const scrollToBottom = async () => {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
			unreadCount = 0;
			hasPendingMention = false;
			isUserAtBottom = true;
		}
	};

	const handleInput = () => {
		const words = message.split(' ');
		const lastWord = words[words.length - 1];
		if (lastWord.startsWith('@')) {
			showMentions = true;
			mentionFilter = lastWord.slice(1).toLowerCase();
			selectedIndex = 0;
		} else {
			showMentions = false;
		}
	};

	const scrollToSelection = (index: number) => {
		setTimeout(() => {
			const container = document.getElementById('mentions-container');
			if (container) {
				const selectedElement = container.children[index + 1] as HTMLElement;
				if (selectedElement) selectedElement.scrollIntoView({ block: 'nearest' });
			}
		}, 0);
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (!showMentions || filteredUsers.length === 0) {
			if (e.key === 'Enter') sendMessage();
			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + filteredUsers.length) % filteredUsers.length;
			scrollToSelection(selectedIndex);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % filteredUsers.length;
			scrollToSelection(selectedIndex);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			selectUser(filteredUsers[selectedIndex]);
		} else if (e.key === 'Escape') showMentions = false;
	};

	const selectUser = (username: string) => {
		const words = message.split(' ');
		words.pop();
		words.push(`@${username} `);
		message = words.join(' ');
		showMentions = false;
		const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
		if (inputEl) inputEl.focus();
	};

	const sendMessage = async () => {
		const text = message.trim();
		if (!text || !currentUser || !messagesRef) return;
		showMentions = false;
		try {
			await push(messagesRef, {
				senderId: currentUser._id?.toString() || 'unknown',
				username: currentUser.username,
				text: text,
				ts: serverTimestamp()
			});
			message = '';
		} catch (error) {
			console.error(error);
		}
	};

	const formatMessage = (text: string) => {
		const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		return safeText.replace(/@([\w_.]+)/g, (match, username) => {
			const isMe = currentUser && username === currentUser.username;
			const colorClass = isMe
				? "text-yellow-400 bg-yellow-900/40 ring-1 ring-yellow-500"
				: "text-teal-300 bg-teal-900/40";
			return `<span class="${colorClass} font-bold px-1 rounded cursor-pointer transition-all hover:opacity-80">@${username}</span>`;
		});
	};
</script>

<div class="flex flex-col h-[calc(100vh-100px)] max-w-6xl mx-auto mt-6 bg-black text-teal-400 font-mono border border-teal-900 rounded-xl overflow-hidden shadow-2xl relative">

	<header class="p-4 border-b border-teal-400 flex items-center justify-between bg-black z-30">
		<div class="flex items-center gap-2">
			<div class="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
			<h1 class="text-xl font-bold tracking-widest uppercase">Community Chat</h1>
		</div>
		<div class="flex items-center gap-4">
			{#if currentUser}
				<span class="text-xs text-teal-600">
					User: <span class="text-teal-400 font-bold">{currentUser.username}</span>
				</span>
			{/if}
		</div>
	</header>

	<div
		bind:this={chatContainer}
		on:scroll={handleScroll}
		style="overflow-anchor: none;"
		class="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 scroll-smooth"
	>
		{#each messages as msg (msg.key)}
			<div class={`flex ${currentUser && msg.data.username === currentUser.username ? 'justify-end' : 'justify-start'}`}>
				<div class="max-w-[80%] flex flex-col">
					<span class={`text-xs font-bold mb-1 text-teal-600 ${currentUser && msg.data.username === currentUser.username ? 'text-right' : 'text-left'}`}>
						{msg.data.username} {msg.key}
					</span>
					<div class={`p-3 rounded-lg border bg-black shadow-lg transition-all duration-300
						${currentUser && msg.data.text.includes(`@${currentUser.username}`) ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'border-teal-400 shadow-[0_0_5px_rgba(45,212,191,0.2)]'}
						${currentUser && msg.data.username === currentUser.username ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
						<p class="text-sm break-words">
							{@html formatMessage(msg.data.text)}
						</p>
					</div>
					<span class={`text-[10px] text-teal-800 mt-1 ${currentUser && msg.data.username === currentUser.username ? 'text-right' : 'text-left'}`}>
						{msg.data.ts ? new Date(msg.data.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
					</span>
				</div>
			</div>
		{/each}

		{#if messages.length === 0}
			<div class="flex h-full items-center justify-center text-teal-800">
				<p>No messages yet.</p>
			</div>
		{/if}
	</div>

	{#if unreadCount > 0 && !isUserAtBottom}
		<button
			on:click={scrollToBottom}
			class={`absolute bottom-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full shadow-2xl border font-bold text-xs flex items-center gap-2 animate-bounce cursor-pointer
				${hasPendingMention
					? 'bg-yellow-900 border-yellow-400 text-yellow-400'
					: 'bg-teal-900 border-teal-400 text-teal-400'}`}
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
			</svg>
			{#if hasPendingMention}
				<span>@ Mentioned ({unreadCount})</span>
			{:else}
				<span>New Messages ({unreadCount})</span>
			{/if}
		</button>
	{/if}

	<div class="p-4 border-t border-teal-400 bg-black relative z-20">

		{#if showMentions && filteredUsers.length > 0}
			<div id="mentions-container" class="absolute bottom-full left-4 mb-2 w-64 bg-zinc-900 border border-teal-400 rounded-lg shadow-2xl overflow-hidden z-50 max-h-48 overflow-y-auto">
				<div class="bg-teal-900/50 p-2 text-xs text-teal-300 border-b border-teal-800 font-bold sticky top-0 backdrop-blur-sm">SUGGESTIONS</div>
				{#each filteredUsers as user, i}
					<button
						class={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2
							${i === selectedIndex ? 'bg-teal-700 text-white' : 'text-teal-400 hover:bg-teal-800/50'}`}
						on:click={() => selectUser(user)}
					>
						<span class="w-2 h-2 rounded-full bg-teal-500"></span>
						{user}
					</button>
				{/each}
			</div>
		{/if}

		{#if currentUser}
			<div class="flex gap-3">
				<input
					bind:value={message}
					on:input={handleInput}
					on:keydown={handleKeydown}
					type="text"
					placeholder="Type a message..."
					class="flex-1 bg-black border border-teal-400 text-teal-400 rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-teal-400 placeholder-teal-800 transition-all"
				/>
				<button
					on:click={sendMessage}
					class="bg-teal-400 text-black font-bold px-6 py-2 rounded hover:bg-teal-300 hover:shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all duration-200"
				>
					SEND
				</button>
			</div>
		{:else}
			<div class="flex justify-center items-center py-2 text-teal-600 border border-teal-900 rounded bg-teal-900/10">
				<p>Please Login at first.</p>
			</div>
		{/if}
	</div>

</div>
