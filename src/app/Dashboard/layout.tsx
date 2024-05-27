import { redirect } from 'next/navigation'
import React from 'react'

const LayoutDashboard = () => {
    redirect("https://dr.arenap.ir/Dashboard")

    return (
        <div>LayoutDashboard</div>
    )
}

export default LayoutDashboard