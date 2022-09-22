import { Link } from 'react-router-dom';

export const DistributorList = ({ distributors, pageIndex }) => {
	return (
		<div>
			<h1 className='text-3xl font-bold py-5'>Distributors</h1>

			{distributors && (
				<div className='overflow-x-auto relative'>
					<table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
						<thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
							<tr>
								<th scope='col' className='py-3 px-6'>
									Distributor
								</th>
							</tr>
						</thead>
						<tbody>
							{distributors &&
								distributors.results.map((distributor) => {
									return (
										<tr
											key={distributor.id}
											className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
										>
											<th
												scope='row'
												className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'
											>
												<Link to={distributor.slug}>{distributor.name}</Link>
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
