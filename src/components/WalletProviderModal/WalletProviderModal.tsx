import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import metamaskLogo from '../../assets/img/metamask-fox.svg'
import walletConnectLogo from '../../assets/img/wallet-connect.svg'

import Button from '../Button'
import Modal, { ModalProps } from '../Modal'
import ModalActions from '../ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'
// import Spacer from '../Spacer'

import WalletCard from './components/WalletCard'
import store from '../../utils/store'
import { message } from 'antd'


const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { account, connect } = useWallet()

  useEffect(() => {
    if (account) {
      onDismiss()
    }
  }, [account, onDismiss])

  const connectType = (type: any) => {
    store.set('connect-type', type)
    if (type === 'walletconnect') {
      message.info(`Please select Rinkeby network node. 请选择Rinkeby网络节点。`)
    }
    connect(type)
  }

  return (
    <Modal>
      <ModalTitle text="Select a wallet provider." />

      <ModalContent>
        <StyledWalletsWrapper>
          <StyledWalletCard>
            <WalletCard
              icon={<img src={metamaskLogo} style={{ height: 32 }} alt="logo" />}
              onConnect={() => connectType('injected')}
              title="Metamask"
            />
          </StyledWalletCard>
          {/* <Spacer size="sm" /> */}
          {/* <StyledWalletCard>
            <WalletCard
              icon={<img src={walletConnectLogo} style={{ height: 24 }} alt="logo" />}
              onConnect={() => connectType('walletconnect')}
              title="WalletConnect"
            />
          </StyledWalletCard> */}
        </StyledWalletsWrapper>
      </ModalContent>

      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
      </ModalActions>
    </Modal>
  )
}

const StyledWalletsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
    flex-direction: column;
    flex-wrap: none;
  }
`

const StyledWalletCard = styled.div`
  flex-basis: calc(50% - ${(props) => props.theme.spacing[2]}px);
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
    margin: 5px 0;
  }
`

export default WalletProviderModal
