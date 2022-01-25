import { providers, Signer } from 'ethers'
import React, {useCallback, useEffect, useState} from 'react'
import { ClipLoader } from 'react-spinners'
import { Erc20TokenData } from '../common/interfaces'
import { Allowance } from './interfaces'
import { compareBN, toFloat } from '../common/util'
import Erc20AllowanceList from './Erc20AllowanceList'
import Erc20TokenBalance from './Erc20TokenBalance'
import { formatAllowance, getAllowancesFromApprovals } from './util'

interface Props {
  signer?: Signer
  provider: providers.Provider
  chainId: number
  token: Erc20TokenData
  signerAddress: string
  inputAddress: string
}

function Erc20Token({ signer, provider, chainId, token, signerAddress, inputAddress }: Props) {
  const [allowances, setAllowances] = useState<Allowance[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const loadData = useCallback(async (token) => {
    setLoading(true)

    // Filter out zero-value allowances and sort from high to low
    const loadedAllowances = (await getAllowancesFromApprovals(token.contract, inputAddress, token.approvals))
      .filter(({ allowance }) => formatAllowance(allowance, token.decimals, token.totalSupply) !== '0.000')
      .sort((a, b) => -1 * compareBN(a.allowance, b.allowance))

    setAllowances(loadedAllowances)
    setLoading(false)
  }, [inputAddress]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData(token)
  }, [loadData, token, inputAddress])

  // Do not render tokens without balance or allowances
  const balanceString = toFloat(Number(token.balance), token.decimals)
  if (balanceString === '0.000' && allowances.length === 0) return null

  if (loading) {
    return (<div className="Token"><ClipLoader size={20} color={'#000'} loading={loading} /></div>)
  }

  return (
    <div className="Token">
      <Erc20TokenBalance
        symbol={token.symbol}
        icon={token.icon}
        balance={token.balance}
        decimals={token.decimals}
      />
      <Erc20AllowanceList
        signer={signer}
        provider={provider}
        inputAddress={inputAddress}
        signerAddress={signerAddress}
        chainId={chainId}
        token={token}
        allowances={allowances}
        onRevoke={(spender) => {
          setAllowances((previousAllowances) => previousAllowances.filter(allowance => allowance.spender !== spender))
        }}
      />
    </div>
  )
}

export default Erc20Token
