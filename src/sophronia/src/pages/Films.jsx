import { useFilmList } from "../api/films";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Films = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const pageLimit = 10;
  const { data, error } = useFilmList(pageIndex, pageLimit);

  // Build the pagination.
  const count = data?.count || 0;
  const pages = Math.ceil(count / pageLimit);
  const pageNumbers = [];
  for (let i = pageIndex; i <= pages; i++) {
    pageNumbers.push(i);
  }


  return(
    <div>
      <h1 className="text-3xl font-bold underline" >Films</h1>

      { data &&
      data.results.map((film) => {
        return(
        <div key={film.id}>
          <h2>{film.name}</h2>
          <p>{film.description}</p>
          <Link to={film.slug}>Link</Link>

        </div>
        )} )}

      <button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>
      <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>

    </div>
  )
}
