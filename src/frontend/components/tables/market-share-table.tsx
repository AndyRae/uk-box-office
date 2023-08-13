import Link from 'next/link';
import { BaseTable, Td, Tr } from '@/components/tables/base-table';
import { toTitleCase } from 'lib/helpers/toTitleCase';

type MarketShare = {
	name: string;
	slug: string;
	marketShare?: number;
	marketPercentage?: number;
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
		{ label: 'box office (£)', isNumeric: true },
		{ label: 'market share', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{data.map((row, index: number) => {
				return (
					<Tr key={index} index={index}>
						<Td isHighlight>
							<Link href={`/distributor/${row.slug}`}>
								{toTitleCase(row.name)}
							</Link>
						</Td>
						<Td isNumeric>{row.marketShare?.toLocaleString('en-GB')}</Td>
						<Td isNumeric>{row.marketPercentage?.toLocaleString('en-GB')}%</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
