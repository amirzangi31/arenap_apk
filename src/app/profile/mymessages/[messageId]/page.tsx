import DetailMessagePage from '@/components/templates/profile/DetailMessagePage'
import { textConsultation } from '@/services/textConsultation/textConsultation'
import React from 'react'

const MessageDetail = async(props: {
    params: {

        messageId: string
    },
    searchParams: {}
}) => {


    
    return (
        <DetailMessagePage messageId={props.params.messageId} />
    )
}

export default MessageDetail