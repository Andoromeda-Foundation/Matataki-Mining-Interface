import { Network, NetworksName } from "../config/index";
import ethers from "ethers";
import ERC20ABI from "../sushi/lib/abi/erc20.json";

/**
 * get token info
 * @param address contract address
 */
export const getTokenInfo = async (address: string) => {
    try {
        let provider = ethers.getDefaultProvider(NetworksName[Network]);
        const contract = new ethers.Contract(address, ERC20ABI, provider)
        let responseName = await contract.name()
        let responseSymbol = await contract.symbol()
        let responseDecimals = await contract.decimals()
        console.log('responseName', responseName, responseSymbol, responseDecimals)
        return {
            name: responseName,
            symbol: responseSymbol,
            decimals: responseDecimals,
        }
    } catch (e) {
        console.log(e)
        return Promise.reject(e)
    }
}
