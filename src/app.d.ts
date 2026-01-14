declare global {
	namespace App {
		interface Locals {
			user: {
				_id: string;
				username: string;
				address: string;
				email?: string;
			} | null;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		ethereum: any;
	}
}

declare module '$env/dynamic/public' {
	export const env: {
		SECRET_GROQ_API_KEY: string;
		[key: string]: string | undefined;
	};
}

export {};