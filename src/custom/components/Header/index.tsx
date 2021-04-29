import React from 'react'
import { ChainId } from '@uniswap/sdk'
import Web3Status from 'components/Web3Status'

import HeaderMod, {
  NetworkCard,
  Title,
  HeaderLinks,
  HeaderRow,
  HeaderControls,
  HeaderElement,
  HideSmall,
  BalanceText,
  AccountElement,
  HeaderElementWrap,
  StyledNavLink
} from './HeaderMod'
import Menu from '../Menu'
import styled from 'styled-components'
import { status as appStatus } from '@src/../package.json'
import { useActiveWeb3React } from 'hooks'
import { useETHBalances } from 'state/wallet/hooks'
import { SHORT_PRECISION } from 'constants/index'

export const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.XDAI]: 'xDAI'
}

const CHAIN_CURRENCY_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.XDAI]: 'xDAI'
}

export interface LinkType {
  id: number
  title: string
  path: string
}

export const HeaderModWrapper = styled(HeaderMod)`
  ${Title} {
    margin: 0;
    text-decoration: none;
    color: ${({ theme }) => theme.text1};
  }

  ${HeaderLinks} {
    margin: 5px 0 0 0;
  }

  ${NetworkCard} {
    background: ${({ theme }) => theme.networkCard.background};
    color: ${({ theme }) => theme.networkCard.text};
  }
`

export const LogoImage = styled.img.attrs(props => ({
  src: props.theme.logo.src,
  alt: props.theme.logo.alt,
  width: props.theme.logo.width,
  height: props.theme.logo.height
}))`
  object-fit: contain;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 150px;
  `};
`

const UniIcon = styled.div`
  display: flex;
  margin: 0 16px 0 0;
  position: relative;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(-5deg);
  }

  &::after {
    content: '${appStatus}';
    display: block;
    font-size: 10px;
    font-weight: bold;
    position: absolute;
    right: 12px;
    top: 2px;
    color: ${({ theme }) => theme.text1};
  }
`

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const nativeToken = chainId && (CHAIN_CURRENCY_LABELS[chainId] || 'ETH')

  return (
    <HeaderModWrapper>
      <HeaderRow>
        <Title href=".">
          <UniIcon>
            <LogoImage />
          </UniIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink to="/swap">Swap</StyledNavLink>
          <StyledNavLink to="/about">About</StyledNavLink>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(SHORT_PRECISION)} {nativeToken}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderModWrapper>
  )
}