import { Suspense } from 'react';
import addDays from 'date-fns/addDays';

import { DashboardControls } from '@/components/controls';
import { Skeleton } from '@/components/skeleton';
import { CountryFilter } from '@/components/country-filter';

import { mapToValues } from '@/lib/helpers/filters';
import { fetchCountryList } from '@/lib/api/dataFetching';
import { parseDate } from '@/lib/helpers/dates';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const start = parseDate(addDays(new Date(), -90));
	const end = parseDate(new Date());
	const countryData = await fetchCountryList(1, 100);
	const countryOptions = mapToValues(countryData.results);

	return (
		<>
			<DashboardControls start={start} end={end}>
				<Suspense fallback={<Skeleton />}>
					<CountryFilter countries={countryOptions} />
				</Suspense>
			</DashboardControls>
			{children}
		</>
	);
}
