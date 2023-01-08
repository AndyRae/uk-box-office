import { getBackendURL } from 'lib/ApiFetcher';

export async function getCountry(slug) {
	const url = getBackendURL();
	const res = await fetch(`${url}country/${slug}`, { cache: 'no-store' });
	return res.json();
}

export default async function Page({ params }) {
	const data = await getCountry(params.slug);

	return (
		<div>
			<br></br>
			Or: {data.slug} - {data.name}
		</div>
	);
}
