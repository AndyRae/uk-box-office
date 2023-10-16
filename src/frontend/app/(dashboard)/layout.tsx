import addDays from 'date-fns/addDays';

import { DashboardControls } from '@/components/controls';

import { parseDate } from '@/lib/helpers/dates';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const start = parseDate(addDays(new Date(), -90));
	const end = parseDate(new Date());

	return (
		<>
			<DashboardControls start={start} end={end}></DashboardControls>
			{children}
		</>
	);
}
