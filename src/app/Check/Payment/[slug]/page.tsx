import PaymentPage from '@/components/templates/PaymentPage'
import { apiDomainNobat } from '@/services/getApiUrlServer'
import urls from '@/services/urls'
import { redirect } from 'next/navigation'
import React from 'react'

const Payment = async (props: { searchParams: { Status: string, AppointmentId: string }, params: { slug: string } }) => {
    console.log(props.searchParams.AppointmentId)
    if (!props.searchParams.Status) {
        redirect("/404")
    }

    if (!props.params.slug && props.searchParams.Status !== "Success") {
        redirect("/404")
    }

    const physician = await fetch(`${apiDomainNobat}${urls.physician.physicianProfile.url}${props.params.slug}`, { cache: "no-store" })
    const data = await physician.json()


    
    
    

    
    const res = await fetch(`${apiDomainNobat}${urls.price.getPrice.url}`, { method: "POST", cache: "no-store" })
    const price = await res.json()
    
    return (
        <PaymentPage price={price} status={props.searchParams?.Status} physician={data?.value} appointmentId={props.searchParams.AppointmentId} />
    )
}

export default Payment