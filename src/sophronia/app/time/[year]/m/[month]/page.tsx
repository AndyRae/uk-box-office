import { TimePage } from '../../../time';

export default function Page({
	params,
}: {
	params: { year: number; month: number };
}) {
	return (
		<>
			<TimePage year={params.year} month={params.month} />
		</>
	);
}
