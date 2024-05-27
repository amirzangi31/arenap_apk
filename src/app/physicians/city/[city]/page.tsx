import React from 'react'
import PhysiciansCityPage from '@/components/templates/PhysiciansCityPage';
import { apiDomainNobat } from '@/services/getApiUrlServer';
import urls from '@/services/urls';

const DcotorsCity = async ({ params }: { params: { locale: string, city: string } }) => {

    const res = await fetch(`${apiDomainNobat}${urls.provinces.physicians.url}${params.city}` , {cache : "no-store"})
    const data = await res.json()

    

    return (
        <PhysiciansCityPage data={data.value} city={params.city} /> 
    )
}

export default DcotorsCity;