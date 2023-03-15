import Link from 'next/link';
import { BaseTable, Td, Tr } from 'components/charts/BaseTable';
import { DistributorListData } from 'interfaces/Distributor';
import { toTitleCase } from 'lib/utils/toTitleCase';

/**
 * Distributor List component
 * @param {DistributorListData} distributors - Distributors to be displayed
 * @returns {JSX.Element}
 * @example
 * <DistributorList distributors={distributors} />
 */
export const DistributorList = ({
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
