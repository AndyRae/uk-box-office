import { InlineLink, ExternalLink } from '../../components/ui/InlineLink';
import { PageTitle } from '../../components/ui/PageTitle';
import { PageContent } from '../../components/ui/PageContent';

export const Api = () => {
	return (
		<>
			<PageTitle>API Access</PageTitle>
			<PageContent>
				<p>
					There is an undocumented API available at:{' '}
					<ExternalLink to='https://api.boxofficedata.co.uk'>
						https://api.boxofficedata.co.uk
					</ExternalLink>
				</p>
				<p>
					It is rate limited and probably not something to build on, but I will
					add documentation at some point.
				</p>

				<p>
					You can look at the{' '}
					<ExternalLink to='https://github.com/AndyRae/uk-box-office'>
						code
					</ExternalLink>{' '}
					for now.
				</p>
				<p>
					You can also download the entire website data at{' '}
					<InlineLink to='/opendata'>Open Data.</InlineLink>
				</p>
			</PageContent>
		</>
	);
};
