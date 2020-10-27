import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import { getStakedPool } from '../sushi/utils'
import useBlock from './useBlock'

const useStakedBalance = (poolContract: Contract) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getStakedPool(poolContract, account)
    setBalance(new BigNumber(balance))
  }, [account, poolContract])

  useEffect(() => {
    if (account) {
      fetchBalance()
    }
  }, [account, poolContract, setBalance, block])

  return balance
}

export default useStakedBalance
