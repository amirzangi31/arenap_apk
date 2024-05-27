import { redirect } from 'next/navigation'
import React from 'react'

const Auth = () => {
    redirect("https://dr.arenap.ir/Auth/Login")

    return (
        <div>Auth</div>
    )
}

export default Auth