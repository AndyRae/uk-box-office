import { getCountry } from './getCountry';

export default async function Head({ params }: { params: { slug: string } }) {
	const country = await getCountry(params.slug);

	return (
		<>
			<title>{`${country.name} | Box Office Data`}</title>
		</>
	);
}
