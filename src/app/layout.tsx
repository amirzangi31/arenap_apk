
import './globals.css'


import iranSans from '@utils/localFonts'

import Layout from '@layouts/Layout'

import StoreProvider from '@/providers/StoreProvider'
import { Suspense } from 'react'
import LoadingPage from './loading'
import GoogleAnalytics from '@/google/GoogleAnalytics'
import { baseUrlSite } from '@/services/urls'
import { Metadata } from 'next'



export const metadata: Metadata = {
  metadataBase: new URL(baseUrlSite),
  title: 'نوبت دهی پزشکان، مشاوره متنی، آنلاین پزشکان | آزناپ',
  description: 'آرناپ بهترین و ساده ترین روش نوبت دهی اینترنتی، مشاوره متنی، آنلاین پزشکان ایران میباشد. در آرناپ شما میتوانید به اطلاعات تماس و آدرس پزشک خود دسترسی داشته باشید. سایت نوبت دهی آرناپ',
  other: {
    author: "پلتفرم آنلاین آرناپ",
    rating: "Safe For Kids",
    index: "googlebot",
    "DC.creator": "پلتفرم آنلاین آرناپ",
    "DC.publisher": "پلتفرم آنلاین آرناپ",
    designer: "Design By Arenap Team  Co. Tel: 02191096760",
    copyright: "پلتفرم آنلاین آرناپ",
    "revisit-after": "3 Days",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'آرناپ : نوبت دهی اینترنتی پزشکان | مشاوره و ویزیت آنلاین',
    description: 'با سامانه آنلاین آرناپ از جستجو و دریافت نوبت از پزشکان و کلینیک ها و درمانگاه ها و بیمارستان ها تا مشاوره و ویزیت آنلاین را داشته باشید',
    creator: 'arenap',
    images: ['https://arenap.ir/favicon.png'], // Must be an absolute URL
  },
  verification: {
    google: "google-site-verification=mpkmOu1C03o47WaPxCFanPz7xcc9G6n-Mbd-jMHRdo8"
  },

  keywords: ["نوبت دهی آنلاین", " مدیریت مالی مطب", "مدیریت مطب آنلاین پزشک", " مدیریت کلینک، ثبت درمان"],
  icons: {
    icon: '/favIcon.png', // /public path
    apple: "/favIcon.png",

  },

}

export default async function RootLayout({
  children,

}: {
  children: React.ReactNode,

}) {




  return (
    <html lang='fa' dir='rtl' >
      <body className={iranSans.className} data-theme="Arenap_theme">

        <Suspense fallback={<LoadingPage />}>
          <StoreProvider>
            <Layout>
              {children}
            </Layout>
          </StoreProvider>
        </Suspense>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics ga_id=
            {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
      </body>
    </html>
  )
}
