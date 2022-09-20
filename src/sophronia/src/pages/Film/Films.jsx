import { useFilmList } from "../../api/films";
import { useState } from "react";
import { FilmList } from "../../components/Film/FilmList";
import { Pagination } from "../../components/ui/Pagination";

export const Films = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const pageLimit = 15;
  const { data, error } = useFilmList(pageIndex, pageLimit);

  // Build the pagination.
  const count = data?.count || 0;
  const pages = Math.ceil(count / pageLimit);
  const pageNumbers = [];
  for (let i = pageIndex; i <= pages; i++) {
    pageNumbers.push(i);
  }
  console.log(pageNumbers)


  return(
    <>
      <FilmList films={data} pageIndex={pageIndex}/>
      <Pagination pages={pageNumbers} setPageIndex={setPageIndex} pageIndex={pageIndex}/>
    </>
  )
}
