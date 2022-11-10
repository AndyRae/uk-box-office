import { useBoxOfficeSummary } from '../../api/boxoffice';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense, useEffect } from 'react';
import { YearsTable } from '../../components/Time/YearsTable';
import { ExportCSV } from '../../components/ui/ExportCSV';
import { AllTimeChart } from '../../components/Time/AllTimeChart';
import { StructuredTimeData } from '../../components/StructuredData';
import { PageTitle } from '../../components/ui/PageTitle';

export const AllTimePage = () => {
	const today = new Date().getFullYear();

	const startDate = `${today}-${1}-${1}`;
	const endDate = `${today}-${12}-${31}`;

	const { data, error } = useBoxOfficeSummary(startDate, endDate, 25);

	useEffect(() => {
		document.title = `All time box office - UK Box Office Data`;
	}, []);

	return (
		<div>
			<StructuredTimeData
				title='All Time Box Office'
				endpoint='/time'
				time={`2001 - ${today}`}
			/>
			<PageTitle>All Time Box Office</PageTitle>

			<AllTimeChart data={data.results} />

			<YearsTable data={data.results} id={'yearstable'} />
			<ExportCSV data={data.results} filename={'alltime.csv'} />
		</div>
	);
};

export const All = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<AllTimePage />
		</Suspense>
	);
};
