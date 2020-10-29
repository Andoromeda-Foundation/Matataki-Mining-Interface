import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useEarnings from '../../../hooks/useEarningsPool'
// import useReward from '../../../hooks/useReward'
import useReward from '../../../hooks/useRewardPool'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { Contract } from 'web3-eth-contract'
import { iconxx } from "../../../utils/index";

interface HarvestProps {
  lpContract?: Contract
  pid: number
  poolContract: Contract
  tokenName: string
  decimals: number
}

const Harvest: React.FC<HarvestProps> = ({ pid, poolContract, tokenName, decimals }) => {
  const earnings = useEarnings(poolContract)
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useReward(poolContract)

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>{iconxx(tokenName.slice(0, 1))}</CardIcon>
            <Value value={getBalanceNumber(earnings, decimals)} />
            <Label text={`${tokenName} Earned`} />
          </StyledCardHeader>
          <StyledCardActions>
            <Button
              disabled={!earnings.toNumber() || pendingTx}
              text={pendingTx ? `Collecting ${tokenName}` : 'Harvest'}
              onClick={async () => {
                setPendingTx(true)
                await onReward()
                setPendingTx(false)
              }}
            />
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

// const StyledSpacer = styled.div`
//   height: ${(props) => props.theme.spacing[4]}px;
//   width: ${(props) => props.theme.spacing[4]}px;
// `

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default Harvest
