import { createConfig, http } from '@wagmi/core';
import { mainnet } from 'viem/chains';
import { injected } from '@wagmi/connectors';

export const config = createConfig({
	chains: [mainnet],
	transports: {
		[mainnet.id]: http(),
	},
	connectors: [
		injected()
	],
});