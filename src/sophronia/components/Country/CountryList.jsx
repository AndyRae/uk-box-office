import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';

/**
 * Country List component
 * @param {Object} countries - Countries to be displayed
 * @returns {JSX.Element}
 * @example
 * <CountryList countries={countries} />
 */
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
