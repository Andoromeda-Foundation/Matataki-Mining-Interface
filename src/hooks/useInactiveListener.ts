import { useEffect } from 'react'
import { useWallet } from 'use-wallet'
import store from '../utils/store'

export function useInactiveListener(suppress = false) {
    const { connect, error, account } = useWallet()

    useEffect(() => {
        if (suppress) {
            return () => { };
        }
        const { ethereum } = window as any;
        const connectMetamask = () => {
            if (store.get('connect-type') === 'injected')
                connect('injected')
        }
        if (ethereum && ethereum.on && !error) {
            const handleChainChanged = (chainId: any) => {
                console.log("chainChanged", chainId);
                connectMetamask()
            };

            const handleAccountsChanged = (accounts: any) => {
                console.log("accountsChanged", accounts);
                if (accounts.length > 0) {
                    connectMetamask()
                }
            };

            const handleNetworkChanged = (networkId: any) => {
                console.log("networkChanged", networkId);
                connectMetamask()
            };

            ethereum.on("chainChanged", handleChainChanged);
            ethereum.on("accountsChanged", handleAccountsChanged);
            ethereum.on("networkChanged", handleNetworkChanged);

            const timer = setInterval(() => {
                console.log('account', account)
                if (!account) {
                    connectMetamask()
                }
            }, 2000)

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener("chainChanged", handleChainChanged);
                    ethereum.removeListener("accountsChanged", handleAccountsChanged);
                    ethereum.removeListener("networkChanged", handleNetworkChanged);
                    console.log('clear')
                    clearInterval(timer)

                }
            };
        }

        return () => { };
    }, [account, connect, error, suppress]);
}