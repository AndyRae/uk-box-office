import { Link } from 'react-router-dom';

export const FilmTable = ({ films }) => {
	return (
		<div className='overflow-x-auto relative'>
			<table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
				<thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
					<tr>
						<th scope='col' className='py-3 px-6'>
							Title
						</th>
						<th scope='col' className='py-3 px-6'>
							Distributor
						</th>
						<th scope='col' className='py-3 px-6'>
							Box Office
						</th>
					</tr>
				</thead>
				<tbody>
					{films &&
						films.results.map((film) => {
							return (
								<tr
									key={film.id}
									className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
								>
									<th
										scope='row'
										className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'
									>
										<Link to={`/film/${film.slug}`}>{film.name}</Link>
									</th>
									<td className='py-4 px-6'>{film.distributor}</td>

									<td className='py-4 px-6'>
										£ {film.gross.toLocaleString('en-GB')}
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
};
