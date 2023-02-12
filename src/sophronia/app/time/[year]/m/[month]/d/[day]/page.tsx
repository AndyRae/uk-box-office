import { TimePage } from '../../../../../time';

export default function Page({
	params,
}: {
	params: { year: number; month: number; day: number };
}) {
	return (
		<>
			<TimePage year={params.year} month={params.month} day={params.day} />
		</>
	);
}
