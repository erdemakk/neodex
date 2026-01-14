import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		throw redirect(303, '/login');
	}
};