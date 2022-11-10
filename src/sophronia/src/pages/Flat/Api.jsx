import { ExternalLink } from '../../components/ui/InlineLink';
import { PageTitle } from '../../components/ui/PageTitle';

export const Api = () => {
	return (
		<div className='flex flex-col max-w-xl space leading-7 space-between gap-4'>
			<PageTitle>API Access</PageTitle>
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
			<p>In the coming months, I'll be adding an entire site data export.</p>
		</div>
	);
};
