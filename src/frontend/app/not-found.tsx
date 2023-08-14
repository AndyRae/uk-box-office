import { PageTitle } from '@/components/custom/page-title';
import { Searchbar } from '@/components/search';

export default function NotFound(): JSX.Element {
	return (
		<>
			<PageTitle>404</PageTitle>
			<p>
				Page not found - sorry, whatever it was has probably moved or deleted.
			</p>
			<p>Try searching:</p>
			<div className='max-w-xl mt-5'>
				<Searchbar />
			</div>
		</>
	);
}
