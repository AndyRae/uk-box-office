import { StatusEvent } from 'interfaces/Event';
import { Card } from 'components/ui/card';
import { DateTime } from 'components/date';

import { MdOutlineErrorOutline, MdCheckCircleOutline } from 'react-icons/md';

export const StatusCard = ({
	status,
}: {
	status: StatusEvent;
}): JSX.Element => {
	const icon =
		status.state?.toString() === 'success' ? (
			<MdCheckCircleOutline />
		) : (
			<MdOutlineErrorOutline />
		);

	return (
		<Card
			title={status.area?.toString().toUpperCase()}
			subtitle={status.date && <DateTime dateString={status.date} />}
			size='lg'
			status={status.state?.toString()}
		>
			{icon} {status.message}
		</Card>
	);
};
