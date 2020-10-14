import { useEffect } from "react"
import ethers from "ethers";

export function useProvider() {
    useEffect(() => {
        // let provider: any = new ethers.providers.Web3Provider((window as any).ethereum)
        let provider: any = new ethers.providers.Web3Provider((window as any).web3.currentProvider);
        console.log('provider', provider);
        (window as any).provider = provider;
    }, [])
}