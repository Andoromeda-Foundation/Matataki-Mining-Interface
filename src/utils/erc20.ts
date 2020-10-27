import Web3 from 'web3'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import ERC20ABI from '../constants/abi/ERC20.json'
import StakingMiningPoolFactoryABI from "../constants/abi/StakingMiningPoolFactory.json";
import StakingRewards from "../constants/abi/StakingRewards.json";

export const getContract = (provider: provider, address: string) => {
  console.log('provider', provider)
  console.log('address', address)
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (ERC20ABI.abi as unknown) as AbiItem,
    address,
  )
  return contract
}

export const getContractFactory = (provider: provider, address: string) => {
  console.log('provider', provider)
  console.log('address', address)
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (StakingMiningPoolFactoryABI as unknown) as AbiItem,
    address,
  )
  return contract
}

export const getContractFactoryStakingRewards = (provider: provider, address: string) => {
  console.log('provider', provider)
  console.log('address', address)
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (StakingRewards as unknown) as AbiItem,
    address,
  )
  return contract
}

export const getAllowance = async (
  lpContract: Contract,
  masterChefContract: Contract,
  account: string,
): Promise<string> => {
  try {
    const allowance: string = await lpContract.methods
      .allowance(account, masterChefContract.options.address)
      .call()
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getBalance = async (
  provider: provider,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const lpContract = getContract(provider, tokenAddress)
  try {
    const balance: string = await lpContract.methods
      .balanceOf(userAddress)
      .call()
    return balance
  } catch (e) {
    return '0'
  }
}
