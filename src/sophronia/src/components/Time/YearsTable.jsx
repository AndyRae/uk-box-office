import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';
import { MetricChange } from '../charts/MetricChange';

export const YearsTable = ({ data, id }) => {
	const columns = [
		{ label: 'year' },
		{ label: 'weekend box office', isNumeric: true },
		{ label: 'total box office', isNumeric: true },
		{ label: 'total change', isNumeric: true },
		{ label: 'new releases', isNumeric: true },
	];
	return (
		<BaseTable columns={columns} id={id}>
			{data.map((year, index) => {
				const previousYear = data[index + 1];
				const changeWeekend = previousYear
					? Math.ceil(
							((year.weekend_gross - previousYear.weekend_gross) /
								previousYear.weekend_gross) *
								100
					  )
					: '-';
				return (
					<Tr key={year.year} index={index}>
						<Td isHighlight>
							<Link to={`/time/${year.year}`}>{year.year}</Link>
						</Td>
						<Td isNumeric>£ {year.weekend_gross.toLocaleString('en-GB')}</Td>
						<Td isNumeric>£ {year.week_gross.toLocaleString('en-GB')}</Td>
						<Td isNumeric>
							<MetricChange value={changeWeekend} />
						</Td>
						<Td isNumeric>{year.number_of_releases}</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
