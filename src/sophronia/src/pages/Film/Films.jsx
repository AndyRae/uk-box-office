import { useFilmList } from "../../api/films";
import { useState } from "react";
import { FilmList } from "../../components/Film/FilmList";
import { Pagination } from "../../components/ui/Pagination";
import { paginate } from "../../utils/pagination";

export const Films = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const pageLimit = 15;
  const { data, error } = useFilmList(pageIndex, pageLimit);

  const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

  return(
    <>
      <FilmList films={data} pageIndex={pageIndex}/>
      <Pagination pages={pageNumbers} setPageIndex={setPageIndex} pageIndex={pageIndex}/>
    </>
  )
}
