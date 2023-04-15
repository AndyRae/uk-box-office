import { Spinner } from 'components/ui/spinner';
import { TimePage } from '../time';

export default function Loading() {
	return (
		<div className='animate-pulse'>
			<TimePage year={2023} results={[]} timeComparisonData={[]} />
		</div>
	);
}
