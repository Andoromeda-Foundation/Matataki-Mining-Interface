import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import useSushi from '../../hooks/useSushi'
import { getMasterChefContract } from '../../sushi/utils'
import Harvest from './components/Harvest'
import Stake from './components/Stake'
import { getTokenInfo, farmLength, farmsAddress, rewardsToken, stakingToken } from '../../utils/contract'
import { getContract, getContractFactory, getContractFactoryStakingRewards } from '../../utils/erc20'

interface farmInterface {
  earnName: string,
  earnSymbol: string,
  earnTokenAddress: string,
  earnDecimals: number,

  stakeName: string,
  stakeSymbol: string,
  stakeTokenAddress: string,
  stakeDecimals: number
}

const farmTemp: farmInterface = {
  earnName: '',
  earnSymbol: '',
  earnTokenAddress: '',
  earnDecimals: 18,

  stakeName: '',
  stakeSymbol: '',
  stakeTokenAddress: '',
  stakeDecimals: 18
}

const Farm: React.FC = () => {
  const { farmId }: { farmId: string } = useParams()
  const {
    pid,
    lpToken,
    lpTokenAddress,
    tokenAddress,
    earnToken,
    name,
    icon,
  } = useFarm(farmId) || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    tokenAddress: '',
    earnToken: '',
    name: '',
    icon: '',
  }
  const [farm, setFarm] = useState<farmInterface>(Object.assign({}, farmTemp))


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {

    const initFarm = async (farmId: string) => {
      const data: farmInterface = Object.assign({}, farmTemp)

      data.earnTokenAddress = await rewardsToken(getContractFactoryStakingRewards(ethereum as provider, farmId))
      data.stakeTokenAddress = await stakingToken(getContractFactoryStakingRewards(ethereum as provider, farmId))

      const earnTokenInfoResult = await getTokenInfo(data.earnTokenAddress)
      data.earnName = earnTokenInfoResult.name
      data.earnSymbol = earnTokenInfoResult.symbol
      data.earnDecimals = earnTokenInfoResult.decimals
      const stakeTokenInfoResult = await getTokenInfo(data.stakeTokenAddress)
      data.stakeName = stakeTokenInfoResult.name
      data.stakeSymbol = stakeTokenInfoResult.symbol
      data.stakeDecimals = stakeTokenInfoResult.decimals

      setFarm(data)

      console.log('data', data)
    }
    initFarm(farmId)
  }, [])

  const sushi = useSushi()
  const { ethereum } = useWallet()

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  const stakeContract = useMemo(() => {
    console.log('stakeContract farm', farm.stakeTokenAddress)
    return getContract(ethereum as provider, farm.stakeTokenAddress)
  }, [ethereum, farm])

  const poolContract = useMemo(() => {
    return getContractFactoryStakingRewards(ethereum as provider, farmId)
  }, [ethereum, farm])

  const { onRedeem } = useRedeem(getMasterChefContract(sushi))

  const lpTokenName = useMemo(() => {
    return lpToken.toUpperCase()
  }, [lpToken])

  const earnTokenName = useMemo(() => {
    return earnToken.toUpperCase()
  }, [earnToken])


  console.log('lpContract', lpContract)

  return (
    <>
      <PageHeader
        icon={icon || '⛰️'}
        subtitle={`Deposit ${farm.stakeSymbol.toUpperCase()}  Tokens and earn ${farm.earnSymbol.toUpperCase()}`}
        title={name}
      />
      <StyledFarm>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <Harvest pid={pid}
              poolContract={poolContract}
              tokenName={farm.earnSymbol.toUpperCase()}
              decimals={farm.earnDecimals}
            />
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <Stake
              lpContract={lpContract}
              stakeContract={stakeContract}
              stakeContracAddress={farm.stakeTokenAddress}
              poolContract={poolContract}
              poolContractAddress={farmId}
              pid={pid}
              tokenName={farm.stakeSymbol.toUpperCase()}
              decimals={farm.stakeDecimals}
            />
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg" />
        <StyledInfo>
          ⭐️ Every time you stake and unstake LP tokens, the contract will
          automagically harvest SUSHI rewards for you!
        </StyledInfo>
        <Spacer size="lg" />
      </StyledFarm>
    </>
  )
}

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

export default Farm
