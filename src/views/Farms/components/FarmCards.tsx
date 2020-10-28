import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'
import { Farm } from '../../../contexts/Farms'
import useAllStakedValue, {
  StakedValue,
} from '../../../hooks/useAllStakedValue'
import useFarms from '../../../hooks/useFarms'
import useSushi from '../../../hooks/useSushi'
import { getEarned, getMasterChefContract } from '../../../sushi/utils'
import { bnToDec, arraySlice, iconxx } from '../../../utils'
import { getTokenInfo, farmLength, farmsAddress, rewardsToken, stakingToken, getFactsOf, getAllFram, getEarnAndStakeTokenAddress, getAllTokenInfo } from "../../../utils/contract";
import { getContractFactory, getContractFactoryStakingRewards } from "../../../utils/erc20";
import { provider } from 'web3-core'
import { StakingMiningPoolFactory } from '../../../constants/tokenAddresses'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber,
  poolAddress?: string,
  earnName?: string,
  earnSymbol?: string,
  earnDecimals?: number,
  stakeName?: string,
  stakeSymbol?: string,
  stakeTokenAddress?: string,
  stakeDecimals?: number,
}

interface tokennInfoInterface {
  name: string,
  symbol: string,
  decimal: string
}

interface poolEarnAndStakeInterface {
  earnTokenAddress: string,
  stakeTokenAddress: string
}

const FarmCards: React.FC = () => {
  const [farmss] = useFarms()
  const [farms, setFarms] = useState([])
  const { ethereum, account }: { account: string; ethereum: provider } = useWallet()
  const stakedValue = useAllStakedValue()

  console.log('farmss', farmss)

  useEffect(() => {

    const initFarm = async () => {
      // 获取有多少个池子
      const contract = getContractFactory(ethereum as provider, StakingMiningPoolFactory)
      const farmNumber = await farmLength(contract)

      // 获取所有池子地址
      const farmListResult = await getAllFram(StakingMiningPoolFactory, farmNumber)
      const farmListResultFilter = farmListResult.filter(i => !!i)
      console.log('farmListResultFilter', farmListResultFilter)

      // 填充一些模版格式
      let list: any[] = []
      farmListResultFilter.forEach(i => {
        console.log('i', i)
        list.push({
          pid: 0,
          name: '',
          lpToken: '',
          lpTokenAddress: '',
          lpContract: '',
          tokenAddress: '',
          earnToken: '',
          icon: '',
          id: '',
          tokenSymbol: '',

          tokenContract: '',

          poolAddress: i,
          earnName: '',
          earnSymbol: '',
          earnTokenAddress: '',
          earnDecimals: 18,

          stakeName: '',
          stakeSymbol: '',
          stakeTokenAddress: '',
          stakeDecimals: 18
        })
      })

      // 获取所有池子质押和奖励的token地址
      const earnAndStakeTokenAddressList: poolEarnAndStakeInterface[] = await getEarnAndStakeTokenAddress(farmListResultFilter)
      earnAndStakeTokenAddressList.forEach((i: poolEarnAndStakeInterface, idx: number) => {
        list[idx].earnTokenAddress = list[idx].earnTokenAddress = i.earnTokenAddress
        list[idx].lpTokenAddress = list[idx].stakeTokenAddress = i.stakeTokenAddress
      })

      // 获取所有token地址去查询
      const tokenInfoAddressList: string[] = []
      earnAndStakeTokenAddressList.forEach((i: poolEarnAndStakeInterface) => {
        tokenInfoAddressList.push(i.earnTokenAddress)
        tokenInfoAddressList.push(i.stakeTokenAddress)
      })
      // 查询所有token信息
      const tokenAddressResult = await getAllTokenInfo(tokenInfoAddressList)
      const tokenInfoResult: tokennInfoInterface[][] = await arraySlice(tokenAddressResult, 2)

      console.log('tokenInfoResult', tokenInfoResult)
      // 写入token信息
      earnAndStakeTokenAddressList.forEach((i: poolEarnAndStakeInterface, idx: number) => {
        list[idx].earnToken = tokenInfoResult[idx][0].name
        list[idx].tokenSymbol = tokenInfoResult[idx][0].symbol
        list[idx].earnName = tokenInfoResult[idx][0].name
        list[idx].earnSymbol = tokenInfoResult[idx][0].symbol
        list[idx].earnDecimals = tokenInfoResult[idx][0].decimal
        list[idx].icon = iconxx((tokenInfoResult[idx][0].symbol).slice(0, 1))

        list[idx].lpToken = tokenInfoResult[idx][1].symbol
        list[idx].stakeName = tokenInfoResult[idx][1].name
        list[idx].stakeSymbol = tokenInfoResult[idx][1].symbol
        list[idx].stakeDecimals = tokenInfoResult[idx][1].decimal
      })

      setFarms(list)
    }
    initFarm()
  }, [])

  const sushiIndex = farms.findIndex(
    ({ tokenSymbol }) => tokenSymbol === 'SUSHI',
  )

  const sushiPrice =
    sushiIndex >= 0 && stakedValue[sushiIndex]
      ? stakedValue[sushiIndex].tokenPriceInWeth
      : new BigNumber(0)

  const BLOCKS_PER_YEAR = new BigNumber(2336000)
  const SUSHI_PER_BLOCK = new BigNumber(1000)

  const rows = farms.reduce<FarmWithStakedValue[][]>(
    (farmRows, farm, i) => {
      const farmWithStakedValue = {
        ...farm,
        ...stakedValue[i],
        apy: stakedValue[i]
          ? sushiPrice
            .times(SUSHI_PER_BLOCK)
            .times(BLOCKS_PER_YEAR)
            .times(stakedValue[i].poolWeight)
            .div(stakedValue[i].totalWethValue)
          : null,
      }
      const newFarmRows = [...farmRows]
      if (newFarmRows[newFarmRows.length - 1].length === 3) {
        newFarmRows.push([farmWithStakedValue])
      } else {
        newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue)
      }
      return newFarmRows
    },
    [[]],
  )

  console.log('farms', farms)
  console.log('rows', rows)

  return (
    <StyledCards>
      {!!rows[0].length ? (
        rows.map((farmRow, i) => (
          <StyledRow key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} />
                {(j === 0 || j === 1) && <StyledSpacer />}
              </React.Fragment>
            ))}
          </StyledRow>
        ))
      ) : (
          <StyledLoadingWrapper>
            <Loader text="Cooking the rice ..." />
          </StyledLoadingWrapper>
        )}
    </StyledCards>
  )
}

interface FarmCardProps {
  farm: FarmWithStakedValue
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const [startTime, setStartTime] = useState(0)
  const [harvestable, setHarvestable] = useState(0)

  const { account } = useWallet()
  const { lpTokenAddress } = farm
  const sushi = useSushi()

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
      <span style={{ width: '100%' }}>
        {paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    )
  }

  useEffect(() => {
    async function fetchEarned() {
      if (sushi) return
      const earned = await getEarned(
        getMasterChefContract(sushi),
        lpTokenAddress,
        account,
      )
      setHarvestable(bnToDec(earned))
    }
    if (sushi && account) {
      fetchEarned()
    }
  }, [sushi, lpTokenAddress, account, setHarvestable])

  const poolActive = true // startTime * 1000 - Date.now() <= 0

  return (
    <StyledCardWrapper>
      {/* {farm.tokenSymbol === 'SUSHI' && <StyledCardAccent />} */}
      {<StyledCardAccent />}
      <Card>
        <CardContent>
          <StyledContent>
            <CardIcon>{farm.icon}</CardIcon>
            <StyledTitle>{farm.earnName + '-' + farm.stakeName}</StyledTitle>
            <StyledDetails>
              <StyledDetail>Deposit {farm.stakeSymbol.toUpperCase()}</StyledDetail>
              <StyledDetail>Earn {farm.earnSymbol.toUpperCase()}</StyledDetail>
            </StyledDetails>
            <Spacer />
            <Button
              disabled={!poolActive}
              text={poolActive ? 'Select' : undefined}
              to={`/farms/${farm.poolAddress}`}
            >
              {!poolActive && (
                <Countdown
                  date={new Date(startTime * 1000)}
                  renderer={renderer}
                />
              )}
            </Button>
            <StyledInsight>
              <span>APY</span>
              <span>
                {farm.apy
                  ? `${farm.apy
                    .times(new BigNumber(100))
                    .toNumber()
                    .toLocaleString('en-US')
                    .slice(0, -1)}%`
                  : 'Loading ...'}
              </span>
              {/* <span>
                {farm.tokenAmount
                  ? (farm.tokenAmount.toNumber() || 0).toLocaleString('en-US')
                  : '-'}{' '}
                {farm.tokenSymbol}
              </span>
              <span>
                {farm.wethAmount
                  ? (farm.wethAmount.toNumber() || 0).toLocaleString('en-US')
                  : '-'}{' '}
                ETH
              </span> */}
            </StyledInsight>
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  )
}

const RainbowLight = keyframes`
  
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const StyledCards = styled.div`
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
`

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
  text-align: center;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: center;
`

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[500]};
`

const StyledInsight = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  background: #fffdfa;
  color: #aa9584;
  width: 100%;
  margin-top: 12px;
  line-height: 32px;
  font-size: 13px;
  border: 1px solid #e6dcd5;
  text-align: center;
  padding: 0 12px;
`

export default FarmCards
