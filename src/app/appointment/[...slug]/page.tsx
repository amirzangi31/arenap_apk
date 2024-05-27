
import AppointmentPage from '@/components/templates/Appointment/AppointmentPage'
import { apiDomainNobat } from '@/services/getApiUrlServer'
import urls, { baseUrlSite } from '@/services/urls'

import convertToHour from '@/utils/convertHour'

import { redirect } from 'next/navigation'
import React from 'react'

export async function generateMetadata({ params }: {
    params: {
        slug: string[],
        locale: string
    }
}) {
    if (!params.slug[1]) {
        redirect("/404")
    }

    let physicianCalendar;
    try {
        const res = await fetch(`${apiDomainNobat}${urls.appointment.calendarPhysician.url}${params.slug[1]}`, {
            cache: "no-store"
        })
        const data = await res.json()
        physicianCalendar = data.value
    } catch (error) {
        redirect("/404")
    }
    
    const title = ` از دکتر ${physicianCalendar?.physicianProfile?.firstName} ${physicianCalendar?.physicianProfile?.lastName} متخصص ${physicianCalendar?.physicianProfile?.specialties[0]?.name} در شهر ${physicianCalendar?.physicianProfile?.city?.name} نوبت بگیرید`
    const description = `از دکتر ${physicianCalendar?.physicianProfile?.firstName} ${physicianCalendar?.physicianProfile?.lastName} متخصص ${physicianCalendar?.physicianProfile?.specialties[0]?.name} که درشهر ${physicianCalendar?.physicianProfile?.city?.name} نوبت حضوری (ویزیت حضوری)، مشاوره آنلاین برای درمان خود از دکتر ${physicianCalendar?.physicianProfile?.firstName} ${physicianCalendar?.physicianProfile?.lastName} نوبت بگیرید`


    return {
        title,
        description,
        alternates: {
            canonical: `/appointment/online-appointment/${physicianCalendar?.physicianProfile?.physicianProfileUrl}`
        },
        authors: [{ name: `دکتر ${physicianCalendar?.physicianProfile?.firstName} ${physicianCalendar?.physicianProfile?.lastName}` }],

    }
}

const Appointment = async ({ params }: {
    params: {
        slug: string[],
        locale: string
    }
}) => {

    let physicianCalendar;
    let ramainingTime;

    try {
        const res = await fetch(`${apiDomainNobat}${urls.appointment.calendarPhysician.url}${params.slug[1]}`, {
            cache: "no-store"
        })
        const data = await res.json()
        physicianCalendar = data.value
    } catch (error) {
        redirect("/404")
    }
    try {
        const res = await fetch(`${apiDomainNobat}${urls.appointment.ramainingTime.url}`, { cache: "no-store" })
        const data = await res.json()

        ramainingTime = data.value.ramainigTime
    } catch (error) {
        redirect("/404")
    }
    console.log(physicianCalendar?.physicianProfileCalendars)


    return (
        <AppointmentPage calendar={physicianCalendar?.physicianProfileCalendars} physician={physicianCalendar.physicianProfile} ramainingTime={ramainingTime} times={convertToHour()} firstAppointment={physicianCalendar.firstppointment} />
    )
}

export default Appointment