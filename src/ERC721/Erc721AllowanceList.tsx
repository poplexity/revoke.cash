import React from 'react'
import { Erc721TokenData } from '../common/interfaces'
import { Allowance } from './interfaces'
import Erc721Allowance from './Erc721Allowance'
import { providers, Signer } from 'ethers'

interface Props {
  signer?: Signer
  provider: providers.Provider
  token: Erc721TokenData
  allowances: Allowance[];
  inputAddress: string
  signerAddress: string
  chainId: number
  onRevoke: (allowance: Allowance) => void;
}

function Erc721AllowanceList({ signer, provider, token, allowances, inputAddress, signerAddress, chainId, onRevoke }: Props) {
  return (
    <div className="AllowanceList">
      {
        allowances.length === 0
          ? <div className="Allowance">No allowances</div>
          : allowances.map((allowance, i) => (
            <Erc721Allowance
              key={i}
              signer={signer}
              provider={provider}
              token={token}
              allowance={allowance}
              inputAddress={inputAddress}
              signerAddress={signerAddress}
              chainId={chainId}
              onRevoke={onRevoke}
            />
          ))
      }
    </div>
  )
}

export default Erc721AllowanceList
