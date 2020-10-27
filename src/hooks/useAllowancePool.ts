import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import useSushi from './useSushi'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { getAllowancePool } from '../utils/erc20'
import { getMasterChefContract } from '../sushi/utils'

const useAllowancePool = (stakeContract: Contract, poolContractAddress: string) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()

  const fetchAllowance = useCallback(async () => {
    let allowance: any = null
    try {
      allowance = await getAllowancePool(
        stakeContract,
        poolContractAddress,
        account,
      )
    } catch (e) {
      console.log('getAllowancePool error', getAllowancePool)
    }
    setAllowance(new BigNumber(allowance))
  }, [account, poolContractAddress, stakeContract])

  useEffect(() => {
    if (account && poolContractAddress && stakeContract) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, poolContractAddress, stakeContract])

  return allowance
}

export default useAllowancePool
