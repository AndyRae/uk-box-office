import { useDistributor } from "../../api/distributors"
import { useParams } from "react-router-dom";

export const Distributor = () => {
  const { slug } = useParams();
  const { data, error } = useDistributor(slug);

  return(
    <div>
      <h1 className="text-3xl font-bold underline">{data.name}</h1>
    </div>
  )
}
