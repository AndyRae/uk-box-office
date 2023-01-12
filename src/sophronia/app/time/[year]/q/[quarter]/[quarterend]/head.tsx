export default async function Head({
	params,
}: {
	params: { year: string; quarter: string; quarterend: string };
}) {
	const title = `Q${params.quarter}-Q${params.quarterend} ${params.year} | Box Office Data`;

	return (
		<>
			<title>{title}</title>
		</>
	);
}
