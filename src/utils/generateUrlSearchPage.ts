const generateUrlSearchPage = (parametrs: {
    specialty: string,
    consultingPlan: string,
    [key: string]: any;
}, queries: {
    gender: string,
    page: string,
    disease: string,
    sign: string,
    service: string,
    search_key : string,
    city: string,
    // itemsCountPerPage: string,
    [key: string]: any
}) => {

    let parametrsUrl: string = "";
    let queriesUrl : string = ""
    let isQuery: boolean = false

    for (let p in parametrs) {
        if (parametrs[p].trim() !== "") {
            parametrsUrl = `${parametrsUrl}/${p}/${parametrs[p]}`
        }
    }
    
    for (let q in queries) {
        if (queries[q].trim() !== ""&& !isQuery) {
            isQuery = true
            queriesUrl = `${queriesUrl}?`
        }
        
        if (queries[q].trim() !== "") {
            queriesUrl = `${queriesUrl}${q}=${queries[q]}${Object.keys(queries).indexOf(q) === Object.keys(queries).length - 1 ? "" :  "&" }`
        }

    }
    
    return `${parametrsUrl}${queriesUrl}`
}


export default generateUrlSearchPage