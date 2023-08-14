import { StatusEvent } from '@/interfaces/Event';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const StatusCard = ({
	status,
}: {
	status: StatusEvent;
}): JSX.Element => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{status.area?.toString().toUpperCase()}</CardTitle>
			</CardHeader>
			<CardContent>
				<p>{status.message}</p>
			</CardContent>
		</Card>
	);
};
