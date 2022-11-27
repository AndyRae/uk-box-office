import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';

export const CountryList = ({ countries }) => {
	const columns = [{ label: 'Country' }];

	return (
		<>
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
		</>
	);
};
