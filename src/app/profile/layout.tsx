import ProfileLayout from '@/components/layouts/ProfileLayout'
import { Metadata } from 'next'

import React, { ReactNode } from 'react'

export const metadata : Metadata = {
    robots : {
        index :false,
        nocache : true,
        
    }
}


const LayoutProfilePage = ({ children }: { children: ReactNode }) => {
    return (
        <ProfileLayout >
            {children}
        </ProfileLayout>
    )
}

export default LayoutProfilePage