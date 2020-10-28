import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink target="_blank" href="https://rinkeby.etherscan.io/address/0xd976a092dd24af37b9f854e64ac9953ee9353e85#readContract">
        Matataki Contract
      </StyledLink>
      {/* <StyledLink
        target="_blank"
        href="https://uniswap.info/pair/0xce84867c3c02b05dc570d0135103d3fb9cc19433"
      >
        Uniswap SUSHI-ETH
      </StyledLink> */}
      {/* <StyledLink target="_blank" href="https://discord.gg/hJ2p555">
        Discord
      </StyledLink> */}
      <StyledLink target="_blank" href="https://github.com/Andoromeda-Foundation/Matataki-Mining-Interface">
        Github
      </StyledLink>
      <StyledLink target="_blank" href="http://matataki.io/">
        Matataki
      </StyledLink>
      {/* <StyledLink target="_blank" href="https://twitter.com/sushiswap">
        Twitter
      </StyledLink> */}
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`

export default Nav
