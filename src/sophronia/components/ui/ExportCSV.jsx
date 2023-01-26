'use client';

import { BsFileEarmarkSpreadsheet } from 'react-icons/bs';
import { Button } from './Button';
import dynamic from 'next/dynamic';

// Needs to be a dynamic import to work in NextJS.
const DynamicCSV = dynamic(
	() => import('react-csv').then((mod) => mod.CSVLink),
	{ ssr: false }
);

/**
 * @file ExportCSV.jsx
 * @description ExportCSV button component with a branded gradient outline.
 * @param {object} data - The data to export
 * @param {string} filename - The filename to export as
 * @returns {JSX.Element}
 * @example
 * <ExportCSV data={data} filename={'TopGunData.csv'} />
 */
export const ExportCSV = ({ data, filename }) => {
	return (
		<Button>
			<div className='px-1'>
				<BsFileEarmarkSpreadsheet />
			</div>
			{data && (
				<DynamicCSV data={data} filename={filename}>
					Export (.csv)
				</DynamicCSV>
			)}
		</Button>
	);
};
