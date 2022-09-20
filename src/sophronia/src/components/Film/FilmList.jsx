import { Pagination } from "../ui/Pagination";
import { Link } from "react-router-dom";

export const FilmList = ({ films, pageIndex, setPageIndex }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold py-5">Films</h1>

      { films &&
        <div class="overflow-x-auto relative">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="py-3 px-6">
                            Title
                        </th>
                        <th scope="col" class="py-3 px-6">
                            Distributor
                        </th>
                        <th scope="col" class="py-3 px-6">
                            Updated
                        </th>
                        <th scope="col" class="py-3 px-6">
                            Box Office
                        </th>
                    </tr>
                </thead>
                <tbody>
                  { films &&
                    films.results.map((film) => {
                      return(
                      <tr key={film.id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <Link to={film.slug}>{film.name}</Link>
                        </th>
                        <td class="py-4 px-6">{film.distributor}</td>
                        <td class="py-4 px-6">{film.weeks[-1]}</td>
                        <td class="py-4 px-6">£ {film.gross}</td>
                      </tr>
                  )} )}
                </tbody>
            </table>
        </div>
      }

    </div>
    );
}