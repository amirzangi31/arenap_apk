import React from 'react'
import PhysiciansPage from '@templates/PhysiciansPage'
import { apiDomainNobat } from '@/services/getApiUrlServer'
import urls from '@/services/urls'

const Doctors = async (props: {
  searchParams: {
    search_key: string,
    page: string,
    disease: string,
    sign: string,
    service: string,
    gender: string,
    city: string
  }
}) => {

  const specialities = await fetch(`${apiDomainNobat}${urls.specialities.getSpecialities.url}`)
  const specialitiesData = await specialities.json()
  const services = await fetch(`${apiDomainNobat}${urls.services.url}`, { next: { revalidate: 60 * 60 * 24 * 1 } }) //one day
  const servicesData = await services.json()


  const parametrs = {
    cityName: props.searchParams.city ? props.searchParams.city : "",
    specialty: "",
    consultingPlan: "",
    search_key: props.searchParams.search_key ? props.searchParams.search_key : "",
    page: props.searchParams.page ? props.searchParams.page : "",
    disease: props.searchParams.disease ? props.searchParams.disease : "",
    sign: props.searchParams.sign ? props.searchParams.sign : "",
    service: props.searchParams.service ? props.searchParams.service : "",
    gender: props.searchParams.gender ? props.searchParams.gender : ""
  }


  const serach = await fetch(`${apiDomainNobat}${urls.advanceSearch.serach.url}?Gender=0&ConsultingPlan=All&PageNumber=1&ItemsCountPerPage=10&filter=${parametrs.search_key}&CityName=${parametrs.cityName}`, { next: { revalidate: 60 * 60 * 24 * 1 } })
  const searchData = await serach.json()


  return (
    <PhysiciansPage hasMore={searchData?.value?.totalPages === searchData?.value?.currentPage ? false : true} specialities={specialitiesData.value} slugs={parametrs} services={servicesData.value} searchData={searchData?.value?.items} searchParams={props.searchParams} />
  )
}

export default Doctors