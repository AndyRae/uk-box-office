import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';

export const CountryList = ({ countries }) => {
	const columns = [{ label: 'Country' }];

	return (
		<div>
			<h1 className='text-3xl font-bold py-5'>Countries</h1>

			{countries && (
				<BaseTable columns={columns}>
					{countries.results.map((country, index) => (
						<Tr key={country.id} index={index}>
							<Td isHighlight>
								<Link to={country.slug}>{country.name}</Link>
							</Td>
						</Tr>
					))}
				</BaseTable>
			)}
		</div>
	);
};
