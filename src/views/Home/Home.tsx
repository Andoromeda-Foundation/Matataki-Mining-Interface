import React from 'react'
import styled from 'styled-components'
import chef from '../../assets/img/matataki.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import Balances from './components/Balances'

const Home: React.FC = () => {
  return (
    <Page>
      <PageHeader
        icon={<img src={chef} height={120} style={{ verticalAlign: 'initial' }} />}
        title="Matataki is Ready"
        subtitle="Stake FAN TICKET tokens to claim your very own yummy TOKEN!"
      />

      {/* <Container>
        <Balances />
      </Container> */}
      <div style={{ height: '200px' }}></div>
      <Spacer size="lg" />
      <StyledInfo>
        🏆<b>Pro Tip</b>: The next rich man is you!
      </StyledInfo>
      <Spacer size="lg" />
      <div
        style={{
          margin: '0 auto',
        }}
      >
        <Button text="🔪 See the Menu" to="/farms" variant="secondary" />
      </div>
    </Page>
  )
}

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

export default Home
