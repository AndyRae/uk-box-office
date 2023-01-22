// import { getCountry } from './getCountry';

export default async function Head({ params }: { params: { slug: string } }) {
	// const country = await getCountry(params.slug);

	// const description = `Get ${country.name} released films data at the UK Box Office.`;

	return (
		<>
			<title>{`Box Office Data`}</title>
			{/* <title>{`${country.name} | Box Office Data`}</title>
			<meta name='description' content={description} />
			<meta property='og:description' content={description} />
			<meta name='twitter:description' content={description} /> */}
		</>
	);
}
