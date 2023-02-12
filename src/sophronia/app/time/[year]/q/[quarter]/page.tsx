import { TimePage } from '../../../time';

export default function Page({
	params,
}: {
	params: { year: number; quarter: number };
}): JSX.Element {
	return (
		<>
			<TimePage year={params.year} quarter={params.quarter} />
		</>
	);
}
