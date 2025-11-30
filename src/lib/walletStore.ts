import { writable } from 'svelte/store';

export const wallet = writable ({
	address: "",
	isConnected: false
});
