import { Network, NetworksName } from "../config/index";
import ethers, { Contract } from "ethers";
import ERC20ABI from '../sushi/lib/abi/erc20.json'
import StakingRewards from '../constants/abi/StakingRewards.json'
import StakingMiningPoolFactory from '../constants/abi/StakingMiningPoolFactory.json'
import { arraySlice } from './index'

import { MaxUint256 } from '@ethersproject/constants'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { aggregateCalls } from "../utils/multicall";

const IERC20 = new ethers.utils.Interface(ERC20ABI)
const IStakingRewards = new ethers.utils.Interface(StakingRewards)
const IStakingMiningPoolFactory = new ethers.utils.Interface(StakingMiningPoolFactory)

interface FactsOfERC20 {
    decimals: number
    totalSupply: BigNumber
    name: string
    symbol: string
}
interface tokennInfoInterface {
    name: string
    symbol: string
    decimal: number
}

interface poolEarnAndStakeInterface {
    earnTokenAddress: string
    stakeTokenAddress: string
    totalSupply: BigNumber
}
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


// multiple

/**
 * 返回所有旷池地址
 * @param contractAddress constract address
 * @param length length
 * ABI
 */
export const getAllFram = async (contractAddress: string, length: number): Promise<string[]> => {
    const fragment = IStakingMiningPoolFactory.getFunction('farms')

    const farmList: number[] = Array.from({ length: Number(length) }, (i: unknown, idx: number) => idx)
    let encodedCalldata = farmList.map((i: number) => ({
        target: contractAddress,
        callData: IStakingMiningPoolFactory.encodeFunctionData(fragment, [i])
    }))
    const { returnData } = await aggregateCalls(encodedCalldata)

    const farmListAddress: string[] = farmList.map((i: number) => {
        const [result] = IStakingMiningPoolFactory.decodeFunctionResult(fragment, returnData[i])
        return result
    })
    return farmListAddress
}
/**
 * 返回由工厂创建的所有池子 earn and stake token address
 * @param contractAddress pool contract address
 * ABI
 */
export const getEarnAndStakeTokenAddress = async (contractAddress: string[]): Promise<poolEarnAndStakeInterface[]> => {
    const fragments = ['rewardsToken', 'stakingToken', 'totalSupply'].map(name => IStakingRewards.getFunction(name))

    let encodedCalldata = contractAddress.map((address: string) => (
        [
            {
                target: address,
                callData: IStakingRewards.encodeFunctionData(fragments[0])
            },
            {
                target: address,
                callData: IStakingRewards.encodeFunctionData(fragments[1])
            },
            {
                target: address,
                callData: IStakingRewards.encodeFunctionData(fragments[2])
            }
        ]
    ))
    const { returnData } = await aggregateCalls(encodedCalldata.flat(2))
    const returnDataList = arraySlice(returnData, fragments.length)

    const farmListTokenAddress: poolEarnAndStakeInterface[] = contractAddress.map((_, idx: number) => {
        let [rewards] = IStakingRewards.decodeFunctionResult(fragments[0], returnDataList[idx][0])
        let [stakeing] = IStakingRewards.decodeFunctionResult(fragments[1], returnDataList[idx][1])
        let [totalSupply] = IStakingRewards.decodeFunctionResult(fragments[2], returnDataList[idx][2])
        return {
            earnTokenAddress: rewards,
            stakeTokenAddress: stakeing,
            totalSupply: totalSupply
        }
    })
    return farmListTokenAddress
}

export const getAllTokenInfo = async (contractAddress: string[]): Promise<tokennInfoInterface[]> => {
    const fragments = ['name', 'symbol', 'decimals'].map(name => IERC20.getFunction(name))

    let encodedCalldata = contractAddress.map((address: string) => (
        [
            {
                target: address,
                callData: IERC20.encodeFunctionData(fragments[0])
            },
            {
                target: address,
                callData: IERC20.encodeFunctionData(fragments[1])
            },
            {
                target: address,
                callData: IERC20.encodeFunctionData(fragments[2])
            }
        ]
    ))
    let { returnData } = await aggregateCalls(encodedCalldata.flat(2))
    const returnDataList = arraySlice(returnData, fragments.length)

    const farmListTokenAddress: tokennInfoInterface[] = contractAddress.map((_, idx: number) => {
        let [nameResult] = IERC20.decodeFunctionResult(fragments[0], returnDataList[idx][0])
        let [symbolResult] = IERC20.decodeFunctionResult(fragments[1], returnDataList[idx][1])
        let [decimalsResult] = IERC20.decodeFunctionResult(fragments[2], returnDataList[idx][2])
        return {
            name: nameResult,
            symbol: symbolResult,
            decimal: decimalsResult,
        }
    })
    return farmListTokenAddress
}