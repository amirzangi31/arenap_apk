


const planNameConvert = (type: string) => {



    switch (type) {
        case "onlineAppointment":
            return "نوبت دهی حضوری"
            break;

        case "textConsultation":
            return "مشاوره متنی"

            break;

        case "voiceConsultation":
            return "مشاوره تلفنی"

            break;

        case "immediateConsultation":

            return "مشاوره تلفنی فوری"
            break;
        case "All":

            return "پلن مشاوره"
            break;

        case "disabled":
            return "لغو شده"

            break;

        default:
            return "نامشخص"
            break;
    }
}

export default planNameConvert