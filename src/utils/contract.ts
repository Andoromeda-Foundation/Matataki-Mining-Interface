import { Network, NetworksName } from "../config/index";
import ethers from "ethers";
import ERC20ABI from "../sushi/lib/abi/erc20.json";
import { MaxUint256 } from '@ethersproject/constants'
import Web3 from 'web3'

// read

//=== StakingMiningPoolFactory
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

export const farmLength = async (contract: any) => {
    try {
        const result = await contract.methods.farmLength().call()
        console.log('farmLength', result)
        return result
    } catch (e) {
        console.log('farmLength error', e)
        return 0
    }
}

export const farmsAddress = async (contract: any, i: string) => {
    try {
        return await contract.methods.farms(i).call()
    } catch (e) {
        console.log('farms error', e)
        return ''
    }
}

//=== StakingRewards
export const rewardsToken = async (contract: any) => {
    try {
        return await contract.methods.rewardsToken().call()
    } catch (e) {
        console.log('rewardsToken error', e)
        return ''
    }
}
export const stakingToken = async (contract: any) => {
    try {
        return await contract.methods.stakingToken().call()
    } catch (e) {
        console.log('stakingToken error', e)
        return ''
    }
}

// write

//=== StakingMiningPoolFactory
export const approve = async (contract: any, poolContract: string, account: string) => {
    console.log('MaxUint256.toString()', MaxUint256.toString())
    return await contract.methods
        .approve(poolContract, MaxUint256.toString())
        .send({ from: account })
}

export const createMiningPool = async (contract: any, name: string, rewardsToken: string, stakingToken: string, amountOfRewards: string, days: string, account: string) => {
    console.log('createMiningPool', name, rewardsToken, stakingToken, amountOfRewards, days)
    return await contract.methods
        .createMiningPool(name, rewardsToken, stakingToken, amountOfRewards, days)
        .send({ from: account })
}

//=== StakingRewards
