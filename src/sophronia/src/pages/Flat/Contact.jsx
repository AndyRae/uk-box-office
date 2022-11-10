import { InlineLink, ExternalLink } from '../../components/ui/InlineLink';
import { PageTitle } from '../../components/ui/PageTitle';
import { PageContent } from '../../components/ui/PageContent';

export const Contact = () => {
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
};
