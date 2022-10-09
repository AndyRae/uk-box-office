import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';

export const WeeksTable = ({ data }) => {
	const columns = [
		{ label: 'week ending' },
		{ label: 'weekend box office', isNumeric: true },
		{ label: 'week box office', isNumeric: true },
		{ label: 'week change', isNumeric: true },
		{ label: 'new releases', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{data.map((week, index) => {
				const previousWeek = data[index + 1];
				const changeWeekend = previousWeek
					? Math.ceil(
							((week.weekendGross - previousWeek.weekendGross) /
								previousWeek.weekendGross) *
								100
					  )
					: '-';
				const [year, month, day] = week.date.split('-');
				return (
					<Tr key={week.date} index={index}>
						<Td isHighlight>
							<Link to={`/time/${year}/m${parseInt(month, 10)}/d${day}`}>
								{week.date}
							</Link>
						</Td>
						<Td isNumeric>£ {week.weekendGross.toLocaleString('en-GB')}</Td>
						<Td isNumeric>£ {week.weekGross.toLocaleString('en-GB')}</Td>
						<Td
							isNumeric
							className={`${
								changeWeekend < 0 ? 'text-red-600' : 'text-green-600'
							}`}
						>
							{changeWeekend}%
						</Td>
						<Td isNumeric>{week.newReleases}</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
