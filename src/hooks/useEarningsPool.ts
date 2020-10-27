import { useCallback, useEffect, useState } from 'react'
import { Contract } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarnedPool } from '../sushi/utils'
import useBlock from './useBlock'

const useEarnings = (poolContract: Contract) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getEarnedPool(poolContract, account)
    setBalance(new BigNumber(balance))
  }, [account, poolContract])

  useEffect(() => {
    if (account && poolContract) {
      fetchBalance()
    }
  }, [account, block, poolContract, setBalance])

  return balance
}

export default useEarnings
