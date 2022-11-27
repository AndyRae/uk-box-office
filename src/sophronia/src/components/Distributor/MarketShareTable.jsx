import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';

export const MarketShareTable = ({ data }) => {
	const columns = [
		{ label: 'distributor' },
		{ label: 'box office', isNumeric: true },
		{ label: 'market share', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{data.map((row, index) => {
				// console.log(row);
				return (
					<Tr key={index} index={index}>
						<Td isHighlight>
							<Link to={`/distributor/${row.slug}`}>{row.name}</Link>
						</Td>
						<Td isNumeric>£ {row.marketShare.toLocaleString('en-GB')}</Td>
						<Td isNumeric>{Math.ceil(row.marketPercentage * 100)}%</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
