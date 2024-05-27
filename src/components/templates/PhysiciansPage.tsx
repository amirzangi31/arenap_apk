"use client"
import React, { useEffect, useState } from 'react'
import SearchSectionPrimary from '@modules/search/SearchSectionPrimary'
import LinkElement from '@elements/LinkElement'
import ChnageCityButton from '@elements/ChangeCityButton'
import FilterIcon from '@icons/FilterIcon'
import ViewOrderIcon from '@icons/ViewOrderIcon'
import CloseIcon from '@icons/CloseIcon'
import { useDebouncedCallback } from 'use-debounce'
import { useCookies } from 'react-cookie'
import { usePathname, useRouter } from 'next/navigation'
import Loader from '@elements/Loader'
import FilterTag from '../elements/FilterTag'
import InfiniteScroll from "react-infinite-scroll-component";
import TitlePagesMobile from '../modules/titles/TitlePagesMobile'
import { SpecialityType } from '@/types/global'
import generateUrlSearchPage from '@/utils/generateUrlSearchPage'
import useCity from '@/hooks/useCity'
import convertGender from '@/utils/convertGender'
import planNameConvert from '@/utils/planNameConvert'
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { DiseaseType, PhysicianDataSearch, ServiceType, SignType } from '@/types/search'
import { specialtyBelongings } from '@/services/specialtyBelongings/specialtyBelongings'
import SearchCardPrimary from '../modules/cards/Search/SearchCardPrimary'
import PhysicianLoadingPrimaryCard from '../modules/cards/Skeletons/PhysicianLoadingPrimaryCard'
import { apiDomainNobat } from '@/services/getApiUrl'
import urls from '@/services/urls'
import Toastify from '../elements/toasts/Toastify'



export type PhysiciansPageProps = {
    slugs?: {
        cityName: string,
        specialty: string,
        consultingPlan: string,
        search_key: string,
        page: string,
        disease: string,
        sign: string,
        service: string,
        gender: string
    },
    searchKey?: string | undefined,
    specialities: SpecialityType[],
    services: ServiceType[],
    searchData: PhysicianDataSearch[],
    searchParams: {
        search_key: string,
        page: string,
        disease: string,
        sign: string,
        service: string,
        gender: string
    },
    hasMore: boolean
}


const PhysiciansPage = (props: PhysiciansPageProps) => {
    const { specialities, slugs, services, searchData, searchParams, hasMore } = props
    const [loadingData, setLoadingData] = useState(true)
    const [searchDataClient, setSearchDataClient] = useState<PhysicianDataSearch[] | []>([])
    const [hasMoreSatet, setHasMoreState] = useState(hasMore)
    const [page, setPage] = useState(1)
    const pathName = usePathname()
    const [diseasesLoading, setDiseasesLoading] = useState(false)
    const [searchText, setSearchText] = useState(slugs?.search_key ? slugs?.search_key : "")
    const router = useRouter()
    const [diseases, setDiseases] = useState<DiseaseType[]>([])
    const [signs, setSigns] = useState<SignType[]>([])

    const getDiseaseHandler = async (enName: string) => {
        setDiseasesLoading(true)
        const data = await specialtyBelongings(enName)
        const diseases = data?.diseases
        const signs = data?.signs
        setDiseases(diseases)
        setSigns(signs)
        setDiseasesLoading(false)
    }

    useEffect(() => {
        if (slugs?.specialty) {
            getDiseaseHandler(slugs?.specialty)
        }
    }, [])

    useEffect(() => {
        setSearchDataClient(searchData === undefined ? [] : searchData)
        setLoadingData(false)
    }, [searchData])

    const [cookies] = useCookies(["cityInfo"])
    const [showFilters, setShowFilters] = useState(false)
    const [infoSearch, setInfoSearch] = useState({
        city: slugs?.cityName ? slugs.cityName : ""
    })


    const debouncedTextSearch = useDebouncedCallback(() => {
        
        const url = generateUrlSearchPage({
            consultingPlan: slugs?.consultingPlan ? slugs.consultingPlan : "",
            specialty: slugs?.specialty ? slugs.specialty : "",
        }, {
            city: slugs?.cityName ? slugs.cityName : cookies.cityInfo ? cookies.cityInfo.slug : "",
            disease: slugs?.disease ? slugs.disease : "",
            gender: slugs?.gender ? slugs.gender : "",
            page: slugs?.page ? slugs.page : "",
            search_key: searchText,
            service: slugs?.service ? slugs.service : "",
            sign: slugs?.sign ? slugs.sign : "",
        })
        router.push(`/physicians${url}`)
    }, 750)

    useEffect(() => {

        debouncedTextSearch()

    }, [searchText, cookies?.cityInfo])

    const { provinces, setAllProvince } = useCity()

    const fetchMoreData = () => {
        setLoadingData(true)
        fetch
            (
                `${apiDomainNobat}${urls.advanceSearch.serach.url}?Filter=${searchText}&CityName=${cookies.cityInfo ? cookies.cityInfo.slug : ""}&Gender=${slugs?.gender ? slugs.gender : "0"}&Specialty=${slugs?.specialty ? slugs.specialty : ""}&Disease=${slugs?.disease ? slugs.disease : ""}&Sign=${slugs?.sign ? slugs.sign : ""}&Service=${slugs?.service ? slugs.service : ""}&ConsultingPlan=${slugs?.consultingPlan ? slugs.consultingPlan : "All"}&PageNumber=${page + 1}&ItemsCountPerPage=10`,
            )
            .then((res) => res.json()).then(data => {

                if (data?.value === null) {
                    setSearchDataClient([...searchDataClient]);
                    setHasMoreState(false);
                    return;
                }
                setSearchDataClient([...searchDataClient, ...data.value?.items]);
                setHasMoreState(
                    data.value.currentPage === data.value.totalPages
                        ? false
                        : true
                );
                setPage(data.value.currentPage);
                setLoadingData(false)
            })
            .catch((error) => {
                console.log(error);
                setLoadingData(false)
                Toastify("error", "خطایی رخ داده است");
            });
    }


    return (
        <>
            <TitlePagesMobile title={`جستجو پزشکان آرناپ`} />

            {/* ----------section------------- */}
            {/* serach component */}
            <section className='py-4'>
                <div className='h-[3.3125rem] bg-white max-w-[50rem] mx-auto rounded-[10rem] p-2 flex justify-between items-center relative '>
                    <input value={searchText} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (searchText.length >= 30) {
                            setSearchText(prev => {
                                const textSpliter = prev.split("")
                                const sliceTextSpliter = textSpliter.slice(0, 29)
                                const resultText = sliceTextSpliter.join("")
                                return resultText
                            })
                            return
                        }
                        setSearchText(event.target.value)
                    }} className='md:hiddn text-md placeholder:text-gray-300 flex-1 text-right h-full  md:z-[15]' placeholder='نام پزشک، تخصص ...' />
                    <ChnageCityButton />
                </div>
            </section>
            {/* ----------section------------- */}


            {/* ----------header------------- */}
            {/* header */}
            <header className='w-full rounded-sm shadow-shadow_category bg-white p-4'>
                {pathName !== "/physicians" ? <h1 className='text-lg font-bold text-center' >
                    <span className=''>دکترهای </span>
                    {slugs?.specialty ? (<LinkElement className='text-primary underline underline-offset-4 ' link={`physicians/specialty/${slugs.specialty}`}>{specialities.find((item) => item.enName === slugs.specialty)?.specialityTitle} </LinkElement>) : null}
                    {slugs?.cityName ? (<>
                        در شهر <LinkElement className='text-primary underline underline-offset-4 ' link={`physicians/city/${slugs.cityName}`}>
                            {provinces.find((item: {
                                cityId: number,
                                cityName: string,
                                centerName: string,
                                provinceId: number,
                                provinceName: string,
                                cityEnName: string
                            }) => item.cityEnName === slugs?.cityName)?.cityName
                            }
                        </LinkElement></>) : (<span> در آرناپ</span>)}
                </h1> : null}
                {pathName === "/physicians" ? <h1 className='text-xl font-bold text-center' >نوبت دهی از بهترین دکتر های آرناپ</h1> : null}
            </header>
            {/* ----------header------------- */}

            {/* ----------section------------- */}
            {/* tags in mobile */}
            {pathName !== "/physicians" || Object.keys(searchParams).length ? (
                <section className='md:hidden pt-4 '>
                    <Swiper
                        spaceBetween={10}
                        slidesPerView="auto"
                        speed={1000}
                        modules={[FreeMode, Autoplay]}
                        freeMode={true}

                        dir="rtl"
                    >

                        {slugs?.cityName ?
                            <SwiperSlide className='swiper_width_auto' >
                                <FilterTag id={1} title={provinces.find((item: {
                                    cityId: number,
                                    cityName: string,
                                    centerName: string,
                                    provinceId: number,
                                    provinceName: string,
                                    cityEnName: string
                                }) => item.cityEnName === slugs?.cityName)?.cityName} handler={() => {
                                    const url = generateUrlSearchPage({
                                        consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                        specialty: slugs?.specialty ? slugs?.specialty : "",
                                    },
                                        {
                                            city: "",
                                            disease: slugs?.disease ? slugs?.disease : "",
                                            gender: slugs?.gender ? slugs?.gender : "",
                                            page: slugs?.page ? slugs?.page : "",
                                            search_key: slugs?.search_key ? slugs.search_key : "",
                                            service: slugs?.service ? slugs?.service : "",
                                            sign: slugs?.sign ? slugs?.sign : "",
                                        })
                                    router.push(`/physicians${url}`)
                                    setAllProvince()

                                }} />
                            </SwiperSlide> : null
                        }
                        {slugs?.specialty ?
                            <SwiperSlide className='swiper_width_auto' >
                                <FilterTag id={1} title={specialities.find((item) => item.enName === slugs.specialty)?.specialityTitle} handler={() => {
                                    const url = generateUrlSearchPage({
                                        consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                        specialty: "",
                                    },
                                        {
                                            city: slugs?.cityName ? slugs?.cityName : "",
                                            disease: slugs?.disease ? slugs?.disease : "",
                                            gender: slugs?.gender ? slugs?.gender : "",
                                            page: slugs?.page ? slugs?.page : "",
                                            search_key: slugs?.search_key ? slugs.search_key : "",
                                            service: slugs?.service ? slugs?.service : "",
                                            sign: slugs?.sign ? slugs?.sign : "",
                                        })
                                    router.push(`/physicians${url}`)
                                }} />
                            </SwiperSlide> : null
                        }
                        {slugs?.service ?
                            <SwiperSlide className='swiper_width_auto' >
                                <FilterTag id={1} title={services.find((item) => item.enName === slugs.service)?.name} handler={() => {
                                    const url = generateUrlSearchPage({
                                        consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                        specialty: slugs?.specialty ? slugs.specialty : "",
                                    },
                                        {
                                            city: slugs?.cityName ? slugs?.cityName : "",
                                            disease: slugs?.disease ? slugs?.disease : "",
                                            gender: slugs?.gender ? slugs?.gender : "",
                                            page: slugs?.page ? slugs?.page : "",
                                            search_key: slugs?.search_key ? slugs.search_key : "",
                                            service: "",
                                            sign: slugs?.sign ? slugs?.sign : "",
                                        })
                                    router.push(`/physicians${url}`)
                                }} />
                            </SwiperSlide> : null
                        }
                        {slugs?.disease ?
                            <SwiperSlide className='swiper_width_auto' >
                                <FilterTag id={1} title={diseases.find((item) => item.enName === slugs.disease)?.name} handler={() => {
                                    const url = generateUrlSearchPage({
                                        consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                        specialty: slugs?.specialty ? slugs.specialty : "",
                                    },
                                        {
                                            city: slugs?.cityName ? slugs?.cityName : "",
                                            disease: "",
                                            gender: slugs?.gender ? slugs?.gender : "",
                                            page: slugs?.page ? slugs?.page : "",
                                            search_key: slugs?.search_key ? slugs.search_key : "",
                                            service: slugs?.service ? slugs?.service : "",
                                            sign: slugs?.sign ? slugs?.sign : "",
                                        })
                                    router.push(`/physicians${url}`)
                                }} />
                            </SwiperSlide> : null
                        }
                        {slugs?.sign ?
                            <SwiperSlide className='swiper_width_auto' >
                                <FilterTag id={1} title={signs.find((item) => item.enName === slugs.sign)?.name} handler={() => {
                                    const url = generateUrlSearchPage({
                                        consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                        specialty: slugs?.specialty ? slugs.specialty : "",
                                    },
                                        {
                                            city: slugs?.cityName ? slugs?.cityName : "",
                                            disease: slugs?.disease ? slugs?.disease : "",
                                            gender: slugs?.gender ? slugs?.gender : "",
                                            page: slugs?.page ? slugs?.page : "",
                                            search_key: slugs?.search_key ? slugs.search_key : "",
                                            service: slugs?.service ? slugs?.service : "",
                                            sign: "",
                                        })
                                    router.push(`/physicians${url}`)
                                }} />
                            </SwiperSlide> : null
                        }
                        {slugs?.gender ?
                            <SwiperSlide className='swiper_width_auto' >
                                <FilterTag id={1} title={convertGender(slugs.gender)} handler={() => {
                                    const url = generateUrlSearchPage({
                                        consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                        specialty: slugs?.specialty ? slugs?.specialty : "",
                                    },
                                        {
                                            city: slugs?.cityName ? slugs?.cityName : "",
                                            disease: slugs?.disease ? slugs?.disease : "",
                                            gender: "",
                                            page: slugs?.page ? slugs?.page : "",
                                            search_key: slugs?.search_key ? slugs.search_key : "",
                                            service: slugs?.service ? slugs?.service : "",
                                            sign: slugs?.sign ? slugs?.sign : "",
                                        })
                                    router.push(`/physicians${url}`)
                                }} />
                            </SwiperSlide> : null
                        }
                        {slugs?.consultingPlan ?
                            <SwiperSlide className='swiper_width_auto' >
                                <FilterTag id={1} title={planNameConvert(slugs.consultingPlan)} handler={() => {
                                    const url = generateUrlSearchPage({
                                        consultingPlan: "",
                                        specialty: slugs?.specialty ? slugs?.specialty : "",
                                    },
                                        {
                                            city: slugs?.cityName ? slugs?.cityName : "",
                                            disease: slugs?.disease ? slugs?.disease : "",
                                            gender: slugs?.gender ? slugs?.gender : "",
                                            page: slugs?.page ? slugs?.page : "",
                                            search_key: slugs?.search_key ? slugs.search_key : "",
                                            service: slugs?.service ? slugs?.service : "",
                                            sign: slugs?.sign ? slugs?.sign : "",
                                        })
                                    router.push(`/physicians${url}`)
                                }} />
                            </SwiperSlide> : null
                        }
                        {slugs?.search_key ?
                            <SwiperSlide className='swiper_width_auto' >
                                <FilterTag id={1} title={slugs.search_key} handler={() => {
                                    setSearchText("")
                                    const url = generateUrlSearchPage({
                                        consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                        specialty: slugs?.specialty ? slugs?.specialty : "",
                                    },
                                        {
                                            city: slugs?.cityName ? slugs?.cityName : "",
                                            disease: slugs?.disease ? slugs?.disease : "",
                                            gender: slugs?.gender ? slugs?.gender : "",
                                            page: slugs?.page ? slugs?.page : "",
                                            search_key: "",
                                            service: slugs?.service ? slugs?.service : "",
                                            sign: slugs?.sign ? slugs?.sign : "",
                                        })
                                    router.push(`/physicians${url}`)
                                }} />
                            </SwiperSlide> : null
                        }
                    </Swiper>

                </section>
            ) : null}
            {/* ----------section------------- */}

            {/* ----------section------------- */}
            {/* filter button mobile */}
            <section className='md:hidden flex justify-between items-center gap-4 mt-6'>

                <button
                    type="button"
                    onClick={() => setShowFilters(true)}
                    className="bg-white w-[8.75rem] h-[3.4375rem] rounded-sm shadow-shadow_category flex justify-center items-center gap-2"
                >
                    <FilterIcon />
                    <span className="text-lg font-bold ">فیلترها</span>
                </button>
                <button
                    type="button"

                    className="flex justify-center items-center gap-2"
                >
                    <ViewOrderIcon />
                    <span className="text-lg font-bold ">نمایش براساس</span>
                </button>

            </section>
            {/* ----------section------------- */}

            {/* ----------main------------- */}
            <main className='flex justify-between items-start gap-4 mt-4 relative'>

                {/* ----------section------------- */}
                {/* search section */}

                <SearchSectionPrimary searchParams={searchParams} loading={diseasesLoading} getDisease={getDiseaseHandler} services={services} diseases={diseases} signs={signs} searchText={searchText} showFilters={showFilters} closeFilterHandler={() => setShowFilters(false)} specialities={specialities} slugs={props.slugs} />

                {/* ----------section------------- */}

                {/* ----------section------------- */}
                {/* Search content */}
                <section className='w-full'>
                    {pathName !== "/physicians" || Object.keys(searchParams).length ? (
                        <div className='hidden md:flex shadow-shadow_category justify-start items-center  gap-2 w-full text-md p-2 bg-white rounded-sm min-h-[2.8125rem] mb-4'>
                            <p className='font-bold text-primary min-w-fit'>نتایج فیلتر : </p>
                            <div className='flex justify-start items-center gap-2 flex-wrap'>
                                {
                                    slugs?.cityName ?
                                        <div className='flex justify-center items-center gap-2 px-2 py-1 border border-gray-500 rounded-full cursor-pointer'
                                            onClick={() => {
                                                const url = generateUrlSearchPage({
                                                    consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                                    specialty: slugs?.specialty ? slugs?.specialty : "",
                                                },
                                                    {
                                                        city: "",
                                                        disease: slugs?.disease ? slugs?.disease : "",
                                                        gender: slugs?.gender ? slugs?.gender : "",
                                                        page: slugs?.page ? slugs?.page : "",
                                                        search_key: slugs?.search_key ? slugs.search_key : "",
                                                        service: slugs?.service ? slugs?.service : "",
                                                        sign: slugs?.sign ? slugs?.sign : "",
                                                    })
                                                router.push(`/physicians${url}`)
                                                setAllProvince()
                                            }}>
                                            <span className='text-gray-500'>{provinces.find((item: {
                                                cityId: number,
                                                cityName: string,
                                                centerName: string,
                                                provinceId: number,
                                                provinceName: string,
                                                cityEnName: string
                                            }) => item.cityEnName === slugs?.cityName)?.cityName}</span>
                                            <span ><CloseIcon color='stroke-gray-500' /> </span>
                                        </div> : null
                                }
                                {
                                    slugs?.specialty ?
                                        <div className='flex justify-center items-center gap-2 px-2 py-1 border border-gray-500 rounded-full cursor-pointer'
                                            onClick={() => {
                                                const url = generateUrlSearchPage({
                                                    consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                                    specialty: "",
                                                },
                                                    {
                                                        city: slugs?.cityName ? slugs?.cityName : "",
                                                        disease: slugs?.disease ? slugs?.disease : "",
                                                        gender: slugs?.gender ? slugs?.gender : "",
                                                        page: slugs?.page ? slugs?.page : "",
                                                        search_key: slugs?.search_key ? slugs.search_key : "",
                                                        service: slugs?.service ? slugs?.service : "",
                                                        sign: slugs?.sign ? slugs?.sign : "",
                                                    })
                                                router.push(`/physicians${url}`)
                                            }}>
                                            <span className='text-gray-500'>{specialities.find((item) => item.enName === slugs.specialty)?.specialityTitle}</span>
                                            <span ><CloseIcon color='stroke-gray-500' /> </span>
                                        </div> : null
                                }
                                {
                                    slugs?.disease ?
                                        <div className='flex justify-center items-center gap-2 px-2 py-1 border border-gray-500 rounded-full cursor-pointer'
                                            onClick={() => {
                                                const url = generateUrlSearchPage({
                                                    consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                                    specialty: slugs?.specialty ? slugs?.specialty : "",
                                                },
                                                    {
                                                        city: slugs?.cityName ? slugs?.cityName : "",
                                                        disease: "",
                                                        gender: slugs?.gender ? slugs?.gender : "",
                                                        page: slugs?.page ? slugs?.page : "",
                                                        search_key: slugs?.search_key ? slugs.search_key : "",
                                                        service: slugs?.service ? slugs?.service : "",
                                                        sign: slugs?.sign ? slugs?.sign : "",
                                                    })
                                                router.push(`/physicians${url}`)
                                            }}>
                                            <span className='text-gray-500'>{diseases.find((item) => item.enName === slugs.disease)?.name}</span>
                                            <span ><CloseIcon color='stroke-gray-500' /> </span>
                                        </div> : null
                                }
                                {
                                    slugs?.sign ?
                                        <div className='flex justify-center items-center gap-2 px-2 py-1 border border-gray-500 rounded-full cursor-pointer'
                                            onClick={() => {
                                                const url = generateUrlSearchPage({
                                                    consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                                    specialty: slugs?.specialty ? slugs?.specialty : "",
                                                },
                                                    {
                                                        city: slugs?.cityName ? slugs?.cityName : "",
                                                        disease: slugs?.disease ? slugs?.disease : "",
                                                        gender: slugs?.gender ? slugs?.gender : "",
                                                        page: slugs?.page ? slugs?.page : "",
                                                        search_key: slugs?.search_key ? slugs.search_key : "",
                                                        service: slugs?.service ? slugs?.service : "",
                                                        sign: "",
                                                    })
                                                router.push(`/physicians${url}`)
                                            }}>
                                            <span className='text-gray-500'>{signs.find((item) => item.enName === slugs.sign)?.name}</span>
                                            <span ><CloseIcon color='stroke-gray-500' /> </span>
                                        </div> : null
                                }
                                {
                                    slugs?.service ?
                                        <div className='flex justify-center items-center gap-2 px-2 py-1 border border-gray-500 rounded-full cursor-pointer'
                                            onClick={() => {
                                                const url = generateUrlSearchPage({
                                                    consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                                    specialty: slugs?.specialty ? slugs.specialty : "",
                                                },
                                                    {
                                                        city: slugs?.cityName ? slugs?.cityName : "",
                                                        disease: slugs?.disease ? slugs?.disease : "",
                                                        gender: slugs?.gender ? slugs?.gender : "",
                                                        page: slugs?.page ? slugs?.page : "",
                                                        search_key: slugs?.search_key ? slugs.search_key : "",
                                                        service: "",
                                                        sign: slugs?.sign ? slugs?.sign : "",
                                                    })
                                                router.push(`/physicians${url}`)
                                            }}>
                                            <span className='text-gray-500'>{services.find((item) => item.enName === slugs.service)?.name}</span>
                                            <span ><CloseIcon color='stroke-gray-500' /> </span>
                                        </div> : null
                                }
                                {
                                    slugs?.gender ?
                                        <div className='flex justify-center items-center gap-2 px-2 py-1 border border-gray-500 rounded-full cursor-pointer'
                                            onClick={() => {
                                                const url = generateUrlSearchPage({
                                                    consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                                    specialty: slugs?.specialty ? slugs?.specialty : "",
                                                },
                                                    {
                                                        city: slugs?.cityName ? slugs?.cityName : "",
                                                        disease: slugs?.disease ? slugs?.disease : "",
                                                        gender: "",
                                                        page: slugs?.page ? slugs?.page : "",
                                                        search_key: slugs?.search_key ? slugs.search_key : "",
                                                        service: slugs?.service ? slugs?.service : "",
                                                        sign: slugs?.sign ? slugs?.sign : "",
                                                    })
                                                router.push(`/physicians${url}`)
                                            }}>
                                            <span className='text-gray-500'>{convertGender(slugs.gender)}</span>
                                            <span ><CloseIcon color='stroke-gray-500' /> </span>
                                        </div> : null
                                }
                                {
                                    slugs?.consultingPlan ?
                                        <div className='flex justify-center items-center gap-2 px-2 py-1 border border-gray-500 rounded-full cursor-pointer'

                                            onClick={() => {
                                                const url = generateUrlSearchPage({
                                                    consultingPlan: "",
                                                    specialty: slugs?.specialty ? slugs?.specialty : "",
                                                },
                                                    {
                                                        city: slugs?.cityName ? slugs?.cityName : "",
                                                        disease: slugs?.disease ? slugs?.disease : "",
                                                        gender: slugs?.gender ? slugs?.gender : "",
                                                        page: slugs?.page ? slugs?.page : "",
                                                        search_key: slugs?.search_key ? slugs.search_key : "",
                                                        service: slugs?.service ? slugs?.service : "",
                                                        sign: slugs?.sign ? slugs?.sign : "",
                                                    })
                                                router.push(`/physicians${url}`)
                                            }}

                                        >
                                            <span className='text-gray-500'>{planNameConvert(slugs.consultingPlan)}</span>
                                            <span ><CloseIcon color='stroke-gray-500' /> </span>
                                        </div> : null
                                }
                                {
                                    slugs?.search_key ?
                                        <div className='flex justify-center items-center gap-2 px-2 py-1 border border-gray-500 rounded-full cursor-pointer'
                                            onClick={() => {
                                                setSearchText("")
                                                const url = generateUrlSearchPage({
                                                    consultingPlan: slugs?.consultingPlan ? slugs?.consultingPlan : "",
                                                    specialty: slugs?.specialty ? slugs?.specialty : "",
                                                },
                                                    {
                                                        city: slugs?.cityName ? slugs?.cityName : "",
                                                        disease: slugs?.disease ? slugs?.disease : "",
                                                        gender: slugs?.gender ? slugs?.gender : "",
                                                        page: slugs?.page ? slugs?.page : "",
                                                        search_key: "",
                                                        service: slugs?.service ? slugs?.service : "",
                                                        sign: slugs?.sign ? slugs?.sign : "",
                                                    })
                                                router.push(`/physicians${url}`)

                                            }}
                                        >
                                            <span className='text-gray-500'>{slugs.search_key}</span>
                                            <span ><CloseIcon color='stroke-gray-500' /> </span>
                                        </div> : null
                                }

                            </div>
                        </div>
                    ) : null}

                    {
                        !loadingData && !searchData &&
                        <div className='bg-white p-5 shadow-shadow_category rounded-sm '>
                            <p className='text-center font-bold'>متاسفانه دکتری با فیلترهای جستجوی شما پیدا نشد</p>
                            <p className='text-center text-md max-w-[16rem] mx-auto mt-4'>برای داشتن نتایج بهتر فیلترهای جستجوی خود را عوض کنید</p>
                            <div className='flex justify-center items-center mt-4'>
                                <button type='button' className='text-error font-bold' onClick={() => {
                                    router.push("/physicians")
                                    setSearchText("")
                                }}>حذف فیلترها</button>
                            </div>
                        </div>
                    }

                    <div className=' flex justify-between items-start gap-2 w-full'>
                        <InfiniteScroll
                            dataLength={searchDataClient ? searchDataClient.length : 0}
                            next={fetchMoreData}
                            hasMore={hasMoreSatet}
                            loader={<span></span>}
                        // endMessage={<div className="text-error font-bold">پایان😁</div>}
                        >
                            {searchDataClient?.map((item) => (
                                <SearchCardPrimary key={item.id} {...item} online={item.immediateConsultation} freeMode={false} />
                            ))}
                        </InfiniteScroll>

                    </div>
                    {loadingData ? <LoadingComponent /> : null}
                </section>
                {/* ----------section------------- */}
            </main>
            {/* ----------main------------- */}
        </>
    )
}

export default PhysiciansPage
const LoadingComponent = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full mt-2">
            <PhysicianLoadingPrimaryCard freeMode={false} />
            <PhysicianLoadingPrimaryCard freeMode={false} />
            <PhysicianLoadingPrimaryCard freeMode={false} />
            <PhysicianLoadingPrimaryCard freeMode={false} />
            <PhysicianLoadingPrimaryCard freeMode={false} />
        </div>
    );
};