import { TimePage } from '../time';

export default function Page({ params }: { params: { year: number } }) {
	return (
		<>
			<TimePage year={params.year} />
		</>
	);
}
