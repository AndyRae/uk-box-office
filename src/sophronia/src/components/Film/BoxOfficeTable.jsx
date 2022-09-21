import { Date } from '../Date';

export const BoxOfficeTable = ({ data }) => {
	const alternatingColor = ['bg-white', 'bg-gray-100'];
	const alternatingDarkColor = ['dark:bg-gray-800', 'dark:bg-gray-900'];
	return (
		<table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
			<thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
				<tr>
					<th scope='col' className='py-3 px-3 text-center'>
						Week
					</th>
					<th scope='col' className='py-3 px-3 text-center'>
						Date
					</th>
					<th scope='col' className='py-3 px-3 text-center'>
						Rank
					</th>
					<th scope='col' className='py-3 px-3 text-center'>
						Cinemas
					</th>
					<th scope='col' className='py-3 px-3 text-center'>
						Weekend Box Office
					</th>
					<th scope='col' className='py-3 px-3 text-center'>
						Week Box Office
					</th>
					<th scope='col' className='py-3 px-3 text-center'>
						Change Weekend
					</th>
					<th scope='col' className='py-3 px-3 text-center'>
						Site Average
					</th>
					<th scope='col' className='py-3 px-3 text-center'>
						Total Box Office
					</th>
				</tr>
				{data.weeks.map((week, index) => {
					const previousWeek = data.weeks[index - 1].weekend_gross || 1;
					const changeWeekend =
						(week.weekend_gross - previousWeek) / previousWeek;
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
								className='py-4 px-3 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white'
							>
								{week.weeks_on_release}
							</th>
							<td className='py-4 px-3 text-center'>
								<Date dateString={week.date} />
							</td>
							<td className='py-4 px-3 text-center'>{week.rank}</td>
							<td className='py-4 px-3 text-center'>
								{week.number_of_cinemas}
							</td>
							<td className='py-4 px-3 text-center'>£ {week.weekend_gross}</td>
							<td className='py-4 px-3 text-center'>£ {week.week_gross}</td>
							<td className='py-4 px-3 text-center'>{changeWeekend}</td>
							<td className='py-4 px-3 text-center'>
								£ {Math.ceil(week.site_average)}
							</td>
							<td className='py-4 px-3 text-center'>£ {week.total_gross}</td>
						</tr>
					);
				})}
			</thead>
		</table>
	);
};
