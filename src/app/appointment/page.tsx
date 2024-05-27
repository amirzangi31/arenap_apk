import { redirect } from 'next/navigation'
import React from 'react'

const Appointment = () => {
    redirect("/404")
    return (
        <div>Appointment</div>
    )
}

export default Appointment