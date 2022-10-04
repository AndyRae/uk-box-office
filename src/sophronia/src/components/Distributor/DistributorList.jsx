import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';

export const DistributorList = ({ distributors }) => {
	const columns = [{ label: 'Distributor' }];

	return (
		<div>
			<h1 className='text-3xl font-bold py-5'>Distributors</h1>
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
