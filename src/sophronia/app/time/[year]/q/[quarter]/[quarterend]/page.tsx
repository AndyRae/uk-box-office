import { TimePage } from '../../../../time';

export default function Page({
	params,
}: {
	params: { year: number; quarter: number; quarterend: number };
}) {
	return (
		<>
			<TimePage
				year={params.year}
				quarter={params.quarter}
				quarterend={params.quarterend}
			/>
		</>
	);
}
