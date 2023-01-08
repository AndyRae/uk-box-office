import { getBackendURL } from 'lib/ApiFetcher';

export async function getDistributor(slug) {
	const url = getBackendURL();
	const res = await fetch(`${url}distributor/${slug}`, { cache: 'no-store' });
	return res.json();
}

export default async function Page({ params }) {
	const data = await getDistributor(params.slug);

	return (
		<div>
			<br></br>
			Or: {data.slug} - {data.name}
		</div>
	);
}
