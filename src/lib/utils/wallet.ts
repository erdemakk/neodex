export const connectWallet = async () => {
	if (typeof window !== 'undefined' && window.ethereum) {
		try {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			console.log("Cüzdan bağlandı:", accounts[0]);
			return accounts[0];
		} catch (error) {
			console.error("Cüzdan bağlantı hatası:", error);
			return null;
		}
	} else {
		alert("Please install MetaMask!");
		return null;
	}
};