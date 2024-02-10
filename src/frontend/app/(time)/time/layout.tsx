import { ControlsWrapper } from '@/components/controls';
import { CountryFilter } from '@/components/country-filter';
import { BreadcrumbsTime } from '@/components/custom/breadcrumbs-time';

import { mapToValues } from '@/lib/helpers/filters';
import { fetchCountryList } from '@/lib/api/country';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const countryData = await fetchCountryList(1, 100);
	const countryOptions = mapToValues(countryData.results);

	return (
		<>
			<ControlsWrapper className='hidden md:flex'>
				<BreadcrumbsTime />

				<CountryFilter countries={countryOptions} />
			</ControlsWrapper>
			{children}
		</>
	);
}
