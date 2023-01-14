export default async function Head({ params }: { params: { year: string } }) {
	const title = `${params.year} | Box Office Data`;

	return (
		<>
			<title>{title}</title>
		</>
	);
}
