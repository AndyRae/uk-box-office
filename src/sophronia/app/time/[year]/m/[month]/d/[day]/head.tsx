export default async function Head({
	params,
}: {
	params: { year: string; month: string; day: string };
}) {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	const m = parseInt(params.month);

	const title = `${params.day} ${months[m - 1]} ${
		params.year
	} | Box Office Data`;

	return (
		<>
			<title>{title}</title>
		</>
	);
}