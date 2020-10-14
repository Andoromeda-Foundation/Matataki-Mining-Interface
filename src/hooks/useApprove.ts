import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { approve, getMasterChefContract } from '../sushi/utils'

const useApprove = (lpContract: Contract) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)

  const handleApprove = useCallback(async () => {
    try {
      console.log('lpContract, masterChefContract, account', lpContract, masterChefContract, account)
      const tx = await approve(lpContract, masterChefContract, account)
      console.log('tx', tx)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

export default useApprove
