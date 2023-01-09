import { BsFileEarmarkSpreadsheet } from 'react-icons/bs';
import { Button } from './Button';
import { CSVLink } from 'react-csv';

/**
 * @file ExportCSV.jsx
 * @description ExportCSV button component with a branded gradient outline.
 * @param {object} data - The data to export
 * @param {string} filename - The filename to export as
 * @returns {JSX.Element}
 * @example
 * <ExportCSV data={data} filename={'TopGunData.csv'} />
 * TODO: Fix this in NextJS
 */
export const ExportCSV = ({ data, filename }) => {
	return (
		<Button>
			<div className='px-1'>
				<BsFileEarmarkSpreadsheet />
			</div>
			<CSVLink data={data} filename={filename}>
				Export (.csv)
			</CSVLink>
		</Button>
	);
};
