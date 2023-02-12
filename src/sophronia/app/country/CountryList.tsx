import Link from 'next/link';
import { BaseTable, Td, Tr } from 'components/charts/BaseTable';
import { CountryListData } from 'interfaces/Country';

/**
 * Country List component
 * @param {CountryList} countries - Countries to be displayed
 * @returns {JSX.Element}
 * @example
 * <CountryList countries={countries} />
 */
export const CountryList = ({
	countries,
}: {
	countries: CountryListData;
}): JSX.Element => {
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
