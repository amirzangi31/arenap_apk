

import { getBestPhysician, getNewestPhysician } from "@/services/physicians/physician"
import HomePage from "@templates/HomePage"



export default async function Home() {
  const ratedPhysicians = await getBestPhysician(0, 0, 1, 12)
  const newestPhysicians = await getNewestPhysician();

  


  return (
    <HomePage physicians={ratedPhysicians} newestPhysicians={newestPhysicians} />
  )
}
