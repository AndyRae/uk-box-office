import { Link } from 'react-router-dom';

export const CountryList = ({ countries, pageIndex }) => {
	return (
		<div>
			<h1 className='text-3xl font-bold py-5'>Countries</h1>

			{countries && (
				<div className='overflow-x-auto relative'>
					<table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
						<thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
							<tr>
								<th scope='col' className='py-3 px-6'>
									Country
								</th>
							</tr>
						</thead>
						<tbody>
							{countries &&
								countries.results.map((country) => {
									return (
										<tr
											key={country.id}
											className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
										>
											<th
												scope='row'
												className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'
											>
												<Link to={country.slug}>{country.name}</Link>
											</th>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};
