import Link from 'next/link';
import { BaseTable, Td, Tr } from 'components/tables/base-table';
import { DistributorListData } from 'interfaces/Distributor';
import { toTitleCase } from 'lib/helpers/toTitleCase';

/**
 * Distributor List component
 * @param {DistributorListData} distributors - Distributors to be displayed
 * @returns {JSX.Element}
 * @example
 * <DistributorTable distributors={distributors} />
 */
export const DistributorTable = ({
	distributors,
}: {
	distributors: DistributorListData;
}): JSX.Element => {
	const columns = [{ label: 'Distributor' }];

	return (
		<div>
			{distributors && (
				<BaseTable columns={columns}>
					{distributors.results.map((distributor, index) => (
						<Tr key={distributor.id} index={index}>
							<Td isHighlight>
								<Link href={`distributor/${distributor.slug}`}>
									{toTitleCase(distributor.name)}
								</Link>
							</Td>
						</Tr>
					))}
				</BaseTable>
			)}
		</div>
	);
};
