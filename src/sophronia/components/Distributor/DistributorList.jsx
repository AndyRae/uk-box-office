import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';

/**
 * Distributor List component
 * @param {Object} distributors - Distributors to be displayed
 * @returns {JSX.Element}
 * @example
 * <DistributorList distributors={distributors} />
 */
export const DistributorList = ({ distributors }) => {
	const columns = [{ label: 'Distributor' }];

	return (
		<div>
			{distributors && (
				<BaseTable columns={columns}>
					{distributors.results.map((distributor, index) => (
						<Tr key={distributor.id} index={index}>
							<Td isHighlight>
								<Link to={distributor.slug}>{distributor.name}</Link>
							</Td>
						</Tr>
					))}
				</BaseTable>
			)}
		</div>
	);
};
