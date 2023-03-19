import clsx from 'clsx';
import { BaseTable, Td, Tr } from 'components/tables/base-table';
import { StatusEvent } from 'interfaces/Event';
import { DateTime } from 'components/date';

type Status = 'default' | 'warning' | 'success' | 'error' | string;
const statusStyle: { [key in Status]: string } = {
	default: 'text-gray-800 bg-white dark:text-grey-100 dark:bg-blue-900',
	success: 'text-green-800 bg-green-300 dark:text-green-300 dark:bg-green-900',
	warning:
		'text-yellow-800 bg-yellow-300 dark:text-yellow-300 dark:bg-yellow-900',
	error: 'text-red-800 bg-red-300 dark:text-red-300 dark:bg-red-900',
};

const StatusTag = ({ status }: { status: Status }): JSX.Element => {
	return (
		<span
			className={clsx(
				'text-xs font-medium mr-2 px-2.5 py-0.5 rounded',
				statusStyle[status]
			)}
		>
			{status}
		</span>
	);
};

export const EventsTable = ({
	events,
}: {
	events: StatusEvent[];
}): JSX.Element => {
	const columns = [
		{ label: 'date' },
		{ label: 'area' },
		{ label: 'state' },
		{ label: 'message' },
	];
	return (
		<BaseTable columns={columns}>
			{events.map((event, index: number) => {
				return (
					<Tr key={event.id} index={index}>
						<Td>{event.date && <DateTime dateString={event.date} />}</Td>
						<Td>{event.area.toString().toLocaleUpperCase()}</Td>
						<Td>
							<StatusTag status={event.state?.toString().toLowerCase()} />
						</Td>
						<Td>{event.message}</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
