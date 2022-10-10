import { Date } from '../Date';
import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';
import { MetricChange } from '../charts/MetricChange';

export const BoxOfficeTable = ({ data }) => {
	const columns = [
		{ label: 'week', isNumeric: true },
		{ label: 'date' },
		{ label: 'rank', isNumeric: true },
		{ label: 'cinemas', isNumeric: true },
		{ label: 'weekend box office', isNumeric: true },
		{ label: 'week box office', isNumeric: true },
		{ label: 'change weekend', isNumeric: true },
		{ label: 'site average', isNumeric: true },
		{ label: 'total box office', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{data.weeks.map((week, index) => {
				const previousWeek = data.weeks[index - 1];
				const changeWeekend = previousWeek
					? Math.ceil(
							((week.weekend_gross - previousWeek.weekend_gross) /
								previousWeek.weekend_gross) *
								100
					  )
					: 0;

				const [year, month, day] = week.date.split('-');

				return (
					<Tr key={week.id} index={index}>
						<Td isNumeric>{week.weeks_on_release}</Td>
						<Td isHighlight>
							<Link to={`/time/${year}/m${month}/d${day}`}>
								<Date dateString={week.date} />
							</Link>
						</Td>
						<Td isNumeric>{week.rank}</Td>
						<Td isNumeric>{week.number_of_cinemas}</Td>
						<Td isNumeric>£ {week.weekend_gross.toLocaleString('en-GB')}</Td>
						<Td isNumeric>£ {week.week_gross.toLocaleString('en-GB')}</Td>
						<Td isNumeric>
							<MetricChange value={changeWeekend} />
						</Td>
						<Td isNumeric>
							£ {Math.ceil(week.site_average).toLocaleString('en-GB')}
						</Td>
						<Td isNumeric>£ {week.total_gross.toLocaleString('en-GB')}</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
