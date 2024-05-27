import urls from "../urls";
import { apiDomainNobat } from "../getApiUrlServer";

const getNewestPhysician = async () => {
  try {
    const res = await fetch(
      `${apiDomainNobat}${urls.physician.newestPhysicians.url}`,
      {
        method: urls.physician.newestPhysicians.method,
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 * 60 * 24 * 1 }, //one week ,
      }
    );
    const result = await res.json();
    return result.value;
  } catch (error) {
    console.log(error);
  }
}



const getBestPhysician = async (
  provinceId: number,
  cityId: number,
  pageNumber: number,
  itemsCountPerPage: number
) => {
  const data = {
    cityId,
    provinceId,
    pageNumber,
    itemsCountPerPage,
  };
  try {
    const res = await fetch(
      `${apiDomainNobat}${urls.physician.bestPhysician.url}`,
      {
        method: urls.physician.bestPhysician.method,
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 * 60 * 24 * 7 }, //one week ,
      }
    );
    const result = await res.json();
    return result.value.items;
  } catch (error) {
    console.log(error);
  }
};

const getProfilePhysician = async (physicianProfileUrl: string) => {
  try {
    const res = await fetch(
      `${apiDomainNobat}${urls.physician.physicianProfile.url}${physicianProfileUrl}`,
      {
        next: { revalidate: 60 * 60 * 24 * 3 }, //three days  
      }
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};




export { getBestPhysician, getProfilePhysician, getNewestPhysician };
