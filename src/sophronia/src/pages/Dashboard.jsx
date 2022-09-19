import { useBoxOffice } from "../api/boxoffice";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const { data, error } = useBoxOffice();

  console.log(data)

  return(
    <div>
      <h1 className="text-3xl font-bold underline">Dashboard</h1>

      { data &&
      data.results.map((result) => {
        return(
        <div key={result.id}>
          <h2>{result.film}</h2>
          <Link to={`film/${result.film_slug}`}>Link</Link>

        </div>
        )} )}

    </div>
  )
}
