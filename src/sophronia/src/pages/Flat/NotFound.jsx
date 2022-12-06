import { PageTitle } from '../../components/ui/PageTitle';
import { Searchbar } from '../../components/Search/Searchbar';

export const NotFound = () => {
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
};
