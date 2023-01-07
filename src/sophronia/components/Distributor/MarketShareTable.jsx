import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';

/**
 * @description Market Share Table component
 * @param {Array} data - Array of data
 * @returns {JSX.Element}
 * @example
 * <MarketShareTable data={data} />
 */
export const MarketShareTable = ({ data }) => {
	const columns = [
		{ label: 'distributor' },
		{ label: 'box office', isNumeric: true },
		{ label: 'market share', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{data.map((row, index) => {
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
