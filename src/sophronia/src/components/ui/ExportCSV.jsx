import { BsFileEarmarkSpreadsheet } from 'react-icons/bs';
import { Button } from './Button';
import { CSVLink } from 'react-csv';

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
