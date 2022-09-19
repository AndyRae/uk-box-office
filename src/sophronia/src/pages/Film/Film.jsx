import { useFilm } from "../../api/films"
import { useParams } from "react-router-dom";

export const Film = () => {
  const { slug } = useParams();
  const { data, error } = useFilm(slug);

  return(
    <div>
      <h1 className="text-3xl font-bold underline">{data.name}</h1>
      <h1 className="text-1xl">{data.distributor}</h1>
    </div>
  )
}
