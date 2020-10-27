import { useEffect } from 'react'
import { useWallet } from 'use-wallet'

export function useInactiveListener(suppress = false) {
    const { connect, error, account } = useWallet()

    useEffect(() => {
        if (suppress) {
            return () => { };
        }
        const { ethereum } = window as any;
        if (ethereum && ethereum.on && !error) {
            const handleChainChanged = (chainId: any) => {
                console.log("chainChanged", chainId);
                connect('injected')
            };

            const handleAccountsChanged = (accounts: any) => {
                console.log("accountsChanged", accounts);
                if (accounts.length > 0) {
                    connect('injected')
                }
            };

            const handleNetworkChanged = (networkId: any) => {
                console.log("networkChanged", networkId);
                connect('injected')
            };

            ethereum.on("chainChanged", handleChainChanged);
            ethereum.on("accountsChanged", handleAccountsChanged);
            ethereum.on("networkChanged", handleNetworkChanged);

            const timer = setInterval(() => {
                console.log('account', account)
                if (!account) {
                    connect('injected')
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