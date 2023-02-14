import { StatusEvent } from 'interfaces/Event';
import { Card } from 'components/ui/Card';
import { DateTime } from 'components/Date';

import { MdOutlineErrorOutline, MdCheckCircleOutline } from 'react-icons/md';

export const StatusCard = ({
	status,
}: {
	status: StatusEvent;
}): JSX.Element => {
	const icon =
		status.state.toString() === 'success' ? (
			<MdCheckCircleOutline />
		) : (
			<MdOutlineErrorOutline />
		);

	return (
		<Card
			title={status.area.toString().toUpperCase()}
			subtitle={<DateTime dateString={status.date} />}
			size='lg'
			status={status.state.toString()}
		>
			{icon} {status.message}
		</Card>
	);
};
