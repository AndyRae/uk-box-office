import Link from 'next/link';
import { BaseTable, Td, Tr } from 'components/charts/BaseTable';
import { Country } from 'interfaces/Country';

type CountryListProps = {
	countries: {
		results: Country[];
	};
};

/**
 * Country List component
 * @param {Object} countries - Countries to be displayed
 * @returns {JSX.Element}
 * @example
 * <CountryList countries={countries} />
 */
export const CountryList = ({ countries }: CountryListProps): JSX.Element => {
	const columns = [{ label: 'Country' }];

	return (
		<>
			{countries && (
				<BaseTable columns={columns}>
					{countries.results.map((country, index) => (
						<Tr key={country.id} index={index}>
							<Td isHighlight>
								<Link href={`/country/${country.slug}`}>{country.name}</Link>
							</Td>
						</Tr>
					))}
				</BaseTable>
			)}
		</>
	);
};
