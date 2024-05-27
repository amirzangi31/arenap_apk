import WalletPage from '@/components/templates/profile/WalletPage'
import React from 'react'


export type SearchParamsWalletType = {
    Status?: string, amount?: string, date?: string , ["transaction-number"] : string
}

export type ParamsWallet = {
    
    searchParams: SearchParamsWalletType
}


const Wallet = (props: ParamsWallet) => {

    return (
        <WalletPage params={props.searchParams} />
    )
}

export default Wallet