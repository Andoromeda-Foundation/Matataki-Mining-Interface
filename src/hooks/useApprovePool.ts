import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { approvePool } from '../sushi/utils'

const useApprove = (stakeContract: Contract, poolContractAddress: string) => {
  const { account }: { account: string; ethereum: provider } = useWallet()

  const handleApprove = useCallback(async () => {
    try {
      console.log('stakeContract-poolContractAddress', stakeContract, poolContractAddress, account)
      const tx = await approvePool(stakeContract, poolContractAddress, account)
      console.log('tx', tx)
      return tx
    } catch (e) {
      return false
    }
  }, [account, stakeContract, poolContractAddress])

  return { onApprove: handleApprove }
}

export default useApprove
