import React, { useState } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { useWallet } from 'use-wallet'

import chef from '../../assets/img/matataki.png'

import Button from '../../components/Button'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'

import Farm from '../Farm'

import FarmCards from './components/FarmCards'
import CreatePoolModal from './components/CreatePoolModal'
import styled from 'styled-components'

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const { account } = useWallet()

  // 用来刷新 farms
  const [reloadFarms, setReloadFarms] = useState(0)
  const reloadFarmClick = () => setReloadFarms(Date.now())

  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)
  const [onPresentCreatePoolModal] = useModal(<CreatePoolModal reloadFarmClick={reloadFarmClick} />)

  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader
                icon={<img src={chef} height="120" style={{ verticalAlign: 'initial' }} />}
                subtitle="Earn Fan Ticket tokens by staking Fan Ticket Tokens."
                title="Select Your Favorite Fan Ticket"
              />
              <StyledCreateButton>
                <Button onClick={onPresentCreatePoolModal}>Create</Button>
              </StyledCreateButton>
              <FarmCards reloadFarms={reloadFarms} />
            </Route>
            <Route path={`${path}/:farmId`}>
              <Farm />
            </Route>
          </>
        ) : (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Button
                onClick={onPresentWalletProviderModal}
                text="🔓 Unlock Wallet"
              />
            </div>
          )}
      </Page>
    </Switch>
  )
}

const StyledCreateButton = styled.div`
  max-width: 120px;
  margin: 0 0 40px;
`

export default Farms
