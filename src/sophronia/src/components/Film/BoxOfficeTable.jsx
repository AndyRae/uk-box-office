import { Date } from '../Date';

export const BoxOfficeTable = ({ data }) => {
	const alternatingColor = ['bg-white', 'bg-gray-100'];
	const alternatingDarkColor = ['dark:bg-gray-800', 'dark:bg-gray-900'];
	return (
		<table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
			<thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
				<tr>
					<th scope='col' className='py-3 px-6'>
						Week
					</th>
					<th scope='col' className='py-3 px-6'>
						Date
					</th>
					<th scope='col' className='py-3 px-6'>
						Rank
					</th>
					<th scope='col' className='py-3 px-6'>
						Cinemas
					</th>
					<th scope='col' className='py-3 px-6'>
						Weekend Box Office
					</th>
					<th scope='col' className='py-3 px-6'>
						Week Box Office
					</th>
					<th scope='col' className='py-3 px-6'>
						Change Weekend
					</th>
					<th scope='col' className='py-3 px-6'>
						Site Average
					</th>
					<th scope='col' className='py-3 px-6'>
						Total Box Office
					</th>
				</tr>
				{data.weeks.map((week, index) => {
					return (
						<tr
							key={week.weeks_on_release}
							className={`${
								alternatingColor[index % alternatingColor.length]
							} ${
								alternatingDarkColor[index % alternatingDarkColor.length]
							} border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
						>
							<th
								scope='row'
								className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'
							>
								{week.weeks_on_release}
							</th>
							{/* <td className="py-4 px-6"><Date date={week.date}/></td> */}
							<td className='py-4 px-6'>{week.rank}</td>
							<td className='py-4 px-6'>{week.number_of_cinemas}</td>
							<td className='py-4 px-6'>£ {week.weekend_gross}</td>
							<td className='py-4 px-6'>£ {week.week_gross}</td>
							<td className='py-4 px-6'>{week.change_weekend}</td>
							<td className='py-4 px-6'>
								£ {week.weekend_gross / week.number_of_cinemas}
							</td>
							<td className='py-4 px-6'>£ {week.total_gross}</td>
						</tr>
					);
				})}
			</thead>
		</table>
	);
};
