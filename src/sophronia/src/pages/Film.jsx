import { useFilm } from "../api/films"
import { useParams } from "react-router-dom";

export const Film = () => {
  const { filmId } = useParams();
  const { data, error } = useFilm(filmId);

  return(
    <div>
      <h1 className="text-3xl font-bold underline">{data.name}</h1>
      <h1 className="text-1xl">{data.distributor}</h1>
    </div>
  )
}
