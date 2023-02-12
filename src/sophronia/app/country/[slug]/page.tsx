import { PageTitle } from 'components/ui/PageTitle';
import { CountryFilmsList } from './CountryFilmsList';
import { getCountry } from './getCountry';

export default async function Page({
	params,
}: {
	params: { slug: string };
}): Promise<JSX.Element> {
	const data = await getCountry(params.slug);

	return (
		<div>
			<PageTitle>{data.name}</PageTitle>
			<CountryFilmsList slug={params.slug} />
		</div>
	);
}
