import { redirect } from 'next/navigation'
import React from 'react'

const DoctorsCityNotFound = () => {
    redirect("/physicians")
  return (
    <div>DoctorsCityNotFound</div>
  )
}

export default DoctorsCityNotFound