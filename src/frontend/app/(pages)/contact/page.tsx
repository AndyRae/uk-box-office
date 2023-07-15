import { ExternalLink } from 'components/ui/inline-link';
import { PageTitle } from 'components/ui/page-title';
import { PageContent } from 'components/ui/page-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Contact | Box Office Data',
};

export default function Page(): JSX.Element {
	return (
		<>
			<PageTitle>Contact</PageTitle>
			<PageContent>
				<p>
					This is built by just one person -{' '}
					<ExternalLink to='https://rae.li'>Andy Rae</ExternalLink>.
				</p>
				<p>
					You can email me if you think something is wrong, could be better, or
					want to talk.
				</p>
				<p>hello@rae.li</p>
				<p>
					<ExternalLink to='https://twitter.com/AndyRae_'>
						@AndyRae_
					</ExternalLink>
				</p>
			</PageContent>
		</>
	);
}
