import DefaultTags from '../../../../DefaultTags';

export default async function Head({
	params,
}: {
	params: { year: string; quarter: string };
}) {
	const title = `Q${params.quarter} ${params.year} | Box Office Data`;

	return (
		<>
			<title>{title}</title>
			<DefaultTags />
		</>
	);
}
