import { redirect } from 'next/navigation'
import React from 'react'

const Dashboard = () => {
    redirect("https://dr.arenap.ir/Dashboard")

    return (
        <div>Dashboard</div>
    )
}

export default Dashboard