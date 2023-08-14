'use client';

import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { Icons } from '@/components/icons';

// Needs to be a dynamic import to work in NextJS.
const DynamicCSV = dynamic(
	() => import('react-csv').then((mod) => mod.CSVLink),
	{ ssr: false }
);

interface ExportCsvProps extends React.HTMLAttributes<HTMLDivElement> {
	data: any;
	filename: string;
}

/**
 * @file ExportCSV.jsx
 * @description ExportCSV button component with a branded gradient outline.
 * @param {object} data - The data to export
 * @param {string} filename - The filename to export as
 * @returns {JSX.Element}
 * @example
 * <ExportCSV data={data} filename={'TopGunData.csv'} />
 */
export const ExportCSV = ({
	data,
	filename,
	className,
}: ExportCsvProps): JSX.Element => {
	const Icon = Icons['spreadsheet'];
	return (
		<Button className={className} variant={'outline'}>
			<div className='px-1'>
				<Icon />
			</div>
			{data && (
				<DynamicCSV data={data} filename={filename}>
					Export (.csv)
				</DynamicCSV>
			)}
		</Button>
	);
};
