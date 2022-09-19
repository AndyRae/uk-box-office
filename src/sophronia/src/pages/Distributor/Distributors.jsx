import { useState } from "react";
import { Link } from "react-router-dom";
import { useDistributorList } from "../../api/distributors";

export const Distributors = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const pageLimit = 10;
  const { data, error } = useDistributorList(pageIndex, pageLimit);

  // Build the pagination.
  const count = data?.count || 0;
  const pages = Math.ceil(count / pageLimit);
  const pageNumbers = [];
  for (let i = pageIndex; i <= pages; i++) {
    pageNumbers.push(i);
  }


  return(
    <div>
      <h1 className="text-3xl font-bold underline" >Distributors</h1>

      { data &&
      data.results.map((distributor) => {
        return(
        <div key={distributor.id}>
          <h2>{distributor.name}</h2>
          <Link to={distributor.slug}>Link</Link>

        </div>
        )} )}

      <button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>
      <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>

    </div>
  )
}
