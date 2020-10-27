import { useCallback } from 'react'
import { Contract } from 'web3-eth-contract'
import { useWallet } from 'use-wallet'

import { stakePool } from '../sushi/utils'

const useStake = (poolContract: Contract) => {
  const { account } = useWallet()

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      const txHash = await stakePool(
        poolContract,
        amount,
        decimals,
        account,
      )
      console.log(txHash)
    },
    [account, poolContract],
  )

  return { onStake: handleStake }
}

export default useStake
