import React from 'react'
import PhysicianDetailesPage from '@templates/PhysicianDetailesPage';
import { getProfilePhysician } from '@/services/physicians/physician';
import { redirect } from 'next/navigation';
import { apiDomainNobat } from '@/services/getApiUrlServer';

import urls from '@/services/urls';

export async function generateMetadata(props: {
  params: {
    local: string,
    slug: string
  },
  searchParams: {}
}) {
  const res = await fetch(`${apiDomainNobat}${urls.physician.physicianProfile.url}${props.params.slug}`, { cache: "no-store" })
  const physician = await res.json()


  const title = `نوبت دهی دکتر ${physician?.value?.firstName} ${physician?.value?.lastName} متخصص ${physician?.value?.physicianSpecialities[0]?.specialityTitle} در شهر ${physician?.value?.cityName} | آرناپ`
  const description = `نوبت دهی دکتر ${physician?.value?.firstName} ${physician?.value?.lastName}، متخصص ${physician?.value?.physicianSpecialities[0]?.specialityTitle} در شهر ${physician?.value?.cityName} نوبت  و مشاوره بگیرید. آدرس مطب دکتر ${physician?.value?.firstName} ${physician?.value?.lastName} همراه با شماره تماس برای نوبت حضوری(ویزیت در مطب )، مشاوره متنی `
  console.log(physician)
  return {
    title,
    description,
    authors: [{ name: title }],

    alternates: {
      canonical: `/Physician/${physician?.value?.physicianProfileUrl}`
    },
  }
}



const PhysicainDetailes = async (props: {
  params: {
    local: string,
    slug: string
  },
  searchParams: {}
}) => {

  const res = await fetch(`${apiDomainNobat}${urls.physician.physicianProfile.url}${props.params.slug}`, { cache: "no-store" })
  const data = await res.json()

  console.log(data);
  if (data?.resultCode === 404) {
    // redirect(`/404`)
  }


  return (
    <PhysicianDetailesPage physician={data.value} />
  )
}

export default PhysicainDetailes