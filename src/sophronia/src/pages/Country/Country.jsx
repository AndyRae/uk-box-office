import { useCountry } from "../../api/countries"
import { useParams } from "react-router-dom";

export const Country = () => {
  const { slug } = useParams();
  const { data, error } = useCountry(slug);

  return(
    <div>
      <h1 className="text-3xl font-bold underline">{data.name}</h1>
    </div>
  )
}
