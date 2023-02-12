import Link from 'next/link';
import { BaseTable, Td, Tr } from 'components/charts/BaseTable';

type MarketShare = {
	name: string;
	slug: string;
	marketShare: number;
	marketPercentage: number;
};

/**
 * @description Market Share Table component
 * @param {Array} data - Array of data
 * @returns {JSX.Element}
 * @example
 * <MarketShareTable data={data} />
 */
export const MarketShareTable = ({
	data,
}: {
	data: MarketShare[];
}): JSX.Element => {
	const columns = [
		{ label: 'distributor' },
		{ label: 'box office', isNumeric: true },
		{ label: 'market share', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{data.map((row, index: number) => {
				return (
					<Tr key={index} index={index}>
						<Td isHighlight>
							<Link href={`/distributor/${row.slug}`}>{row.name}</Link>
						</Td>
						<Td isNumeric>£ {row.marketShare.toLocaleString('en-GB')}</Td>
						<Td isNumeric>{Math.ceil(row.marketPercentage * 100)}%</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
