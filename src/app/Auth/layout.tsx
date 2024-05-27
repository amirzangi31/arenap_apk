import { redirect } from 'next/navigation'
import React from 'react'

const LayoutAuth = () => {
    redirect("https://dr.arenap.ir/Dashboard")

    return (
        <div>LayoutAuth</div>
    )
}

export default LayoutAuth