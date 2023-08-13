import { StatusEvent } from 'interfaces/Event';
import { Card } from '@/components/ui/card';
import { DateTime } from '@/components/date';
import { Icons } from '@/components/icons';

export const StatusCard = ({
	status,
}: {
	status: StatusEvent;
}): JSX.Element => {
	const Icon =
		status.state?.toString() === 'success' ? Icons['success'] : Icons['error'];

	return (
		<Card
			title={status.area?.toString().toUpperCase()}
			subtitle={status.date && <DateTime dateString={status.date} />}
			size='lg'
			status={status.state?.toString()}
		>
			<Icon /> {status.message}
		</Card>
	);
};
