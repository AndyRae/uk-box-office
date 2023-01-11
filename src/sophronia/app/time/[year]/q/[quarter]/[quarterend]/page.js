import { TimePage } from '../../../../time';

export default function Page({ params }) {
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
