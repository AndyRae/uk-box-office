import { Button } from 'components/ui/Button';
import { PageTitle } from 'components/ui/PageTitle';
import { PageContent } from 'components/ui/PageContent';
import { StructuredTimeData } from 'components/StructuredData';
import { ExternalLink, InlineLink } from 'components/ui/InlineLink';
import { getBackendURL } from 'lib/ApiFetcher';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Open Data | Box Office Data',
};

export default function Page(): JSX.Element {
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
					Box Office Data is an open data and open source project, all of the
					website data is available to download.
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
					If you use this data in your own work please credit the British Film
					Institute, and UK Box Office Data, and{' '}
					<InlineLink to='/contact'>let me know</InlineLink>; I'd love to see
					what you do with it.
				</p>
				<Button>
					<a href={`${getBackendURL()}boxoffice/archive`}>
						All Time Box Office Data (.csv)
					</a>
				</Button>
			</PageContent>
		</>
	);
}
