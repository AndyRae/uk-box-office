import Link from 'next/link';
import { BaseTable, Td, Tr } from 'components/charts/BaseTable';

type DistributorListProps = {
	distributors: { results: Array<{ id: string; name: string; slug: string }> };
};

/**
 * Distributor List component
 * @param {Object} distributors - Distributors to be displayed
 * @returns {JSX.Element}
 * @example
 * <DistributorList distributors={distributors} />
 */
export const DistributorList = ({
	distributors,
}: DistributorListProps): JSX.Element => {
	const columns = [{ label: 'Distributor' }];

	return (
		<div>
			{distributors && (
				<BaseTable columns={columns}>
					{distributors.results.map((distributor, index) => (
						<Tr key={distributor.id} index={index}>
							<Td isHighlight>
								<Link href={`distributor/${distributor.slug}`}>
									{distributor.name}
								</Link>
							</Td>
						</Tr>
					))}
				</BaseTable>
			)}
		</div>
	);
};
