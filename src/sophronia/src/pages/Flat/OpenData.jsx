import { Button } from '../../components/ui/Button';
import { PageTitle } from '../../components/ui/PageTitle';
import { PageContent } from '../../components/ui/PageContent';
import { Link } from 'react-router-dom';
import { StructuredTimeData } from '../../components/StructuredData';
import { ExternalLink, InlineLink } from '../../components/ui/InlineLink';

export const OpenData = () => {
	return (
		<>
			<StructuredTimeData
				title='UK Box Office 2001 - 2023'
				endpoint='/opendata'
				time='2001-2023'
			/>
			<PageTitle>Open Data</PageTitle>
			<PageContent>
				<p>
					Box Office Data is an open data and open source project. All data is
					available for download under the{' '}
					<ExternalLink to='https://creativecommons.org/licenses/by/4.0/'>
						Creative Commons Attribution 4.0 International License
					</ExternalLink>
					.
				</p>
				<p>
					Although you can think of this website as a combination of all of the
					BFI's{' '}
					<ExternalLink to='https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures'>
						Weekend Box Office Figures
					</ExternalLink>
					. The data has been extensively cleaned and corrected. But there are
					still errors, and if you find any please{' '}
					<InlineLink to='/contact'>contact me</InlineLink>.
				</p>
				<p>
					Every page has its individual data available to download, but you can
					also download the entire dataset as a single CSV file below.
				</p>
				<p>
					If you use this data in your own work please credit the source, and{' '}
					<InlineLink to='/contact'>let me know</InlineLink>; I'd love to see
					what you do with it.
				</p>
				<Button>
					<a
						href={`${
							process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/'
						}boxoffice/archive`}
					>
						All Time Box Office Data (.csv)
					</a>
				</Button>
			</PageContent>
		</>
	);
};
