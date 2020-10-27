import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { unstakePool } from '../sushi/utils'

const useUnstake = (poolContract: Contract) => {
  const { account } = useWallet()

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      const txHash = await unstakePool(poolContract, amount, decimals, account)
      console.log(txHash)
    },
    [account, poolContract],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
