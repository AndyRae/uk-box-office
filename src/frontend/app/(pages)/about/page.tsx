import { InlineLink, ExternalLink } from '@/components/ui/inline-link';
import { PageTitle } from '@/components/ui/page-title';
import { PageContent } from '@/components/ui/page-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'About | Box Office Data',
};

export default function Page(): JSX.Element {
	return (
		<>
			<PageTitle>About</PageTitle>

			<PageContent>
				<p>
					UK Box Office data is the most detailed and searchable source for box
					office data in the UK.
				</p>
				<p>
					Through using the{' '}
					<ExternalLink to='https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures'>
						BFI weekend box office reports
					</ExternalLink>
					, it visualises box office back to January 1980, with new data every
					week on a Wednesday.
				</p>
				<p>
					This is a tool ideal for film professionals, researchers, and
					students; aiming to help create a more intelligent and open sector.
					Before this website, you had to dig through those spreadsheets or rely
					on box office mojo, which is in dollars.
				</p>
				<p>
					It is not an exhaustive data set - the source only includes the weekly
					box office for the top 15 films, British films, and new releases. But
					this still covers ~99%+ of the market back to 2001. There are also
					inevitably some errors in the data, as there are over 15,000 films,
					1,000 distributors, and 50,000 weekly records.
				</p>
				<p>
					This does leave some unfortunate gaps, for example{' '}
					<InlineLink to={'/film/the-quiet-girl-an-cailin-ciuin'}>
						An Cailín Ciúin (The Quiet Girl)
					</InlineLink>{' '}
					reached
					<ExternalLink to='https://variety.com/2022/film/box-office/ireland-oscar-the-quiet-girl-box-office-1235398733/'>
						{' '}
						over €1m
					</ExternalLink>
					, but we couldn't capture that data. Quite simply - the BFI don't
					publish everything.
				</p>
				<p>
					But there is a lot of data, and plenty of ways to visualise it -{' '}
					<InlineLink to={'/contact'}>
						please do get in touch with me{' '}
					</InlineLink>
					if you have an idea that could make the site better, or more useful
					for you.
				</p>
				<p>
					The code for this website is open sourced under a MIT license, and
					available on{' '}
					<ExternalLink to='https://github.com/AndyRae/uk-box-office'>
						Github
					</ExternalLink>
					.
				</p>
				<p>
					Interested in how it works?{' '}
					<ExternalLink to='https://rae.li/posts/uk-box-office-data-studio-to-flask'>
						Read more
					</ExternalLink>
					.
				</p>
			</PageContent>
		</>
	);
}
