import { Link } from 'react-router-dom';

export const FilmTable = ({ films }) => {
	return (
		<div className='overflow-x-auto my-8 relative'>
			<table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
				<thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
					<tr>
						<th scope='col' className='py-3 px-6'>
							Rank
						</th>
						<th scope='col' className='py-3 px-6'>
							Title
						</th>
						<th scope='col' className='py-3 px-6'>
							Distributor
						</th>
						<th scope='col' className='py-3 px-6'>
							Weekend Box Office
						</th>
						<th scope='col' className='py-3 px-6'>
							Week Box Office
						</th>
						<th scope='col' className='py-3 px-6'>
							Weeks
						</th>
						<th scope='col' className='py-3 px-6'>
							Cinemas
						</th>
						<th scope='col' className='py-3 px-6'>
							Site Average
						</th>
					</tr>
				</thead>
				<tbody>
					{films &&
						films.map((film, index) => {
							return (
								<tr
									key={film.title}
									className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
								>
									<th
										scope='row'
										className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'
									>
										{index + 1}
									</th>
									<th scope='row' className='py-4 px-6'>
										<Link to={`/film/${film.filmSlug}`}>{film.title}</Link>
									</th>
									<td className='py-4 px-6'>{film.distributor}</td>

									<td className='py-4 px-6'>£ 0</td>
									<td className='py-4 px-6'>
										£ {film.weekGross.toLocaleString('en-GB')}
									</td>
									<td className='py-4 px-6'>{film.weeks}</td>
									<td className='py-4 px-6'>{film.numberOfCinemas}</td>
									<td className='py-4 px-6'>
										{/* £ {film.siteAverage.toLocaleString('en-GB')} */}
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
};
