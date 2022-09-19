import { useState } from "react";
import { Link } from "react-router-dom";
import { useCountryList } from "../../api/countries";

export const Countries = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const pageLimit = 10;
  const { data, error } = useCountryList(pageIndex, pageLimit);

  // Build the pagination.
  const count = data?.count || 0;
  const pages = Math.ceil(count / pageLimit);
  const pageNumbers = [];
  for (let i = pageIndex; i <= pages; i++) {
    pageNumbers.push(i);
  }


  return(
    <div>
      <h1 className="text-3xl font-bold underline" >Countries</h1>

      { data &&
      data.results.map((country) => {
        return(
        <div key={country.id}>
          <h2>{country.name}</h2>
          <Link to={country.slug}>Link</Link>

        </div>
        )} )}

      <button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>
      <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>

    </div>
  )
}
