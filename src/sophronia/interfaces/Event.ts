export type EventState = {
	Success: 'success';
	Warning: 'warning';
	Error: 'error';
};

export type Area = {
	ETL: 'etl';
	Forecast: 'forecast';
	Archive: 'archive';
};

export interface StatusEvent {
	id: number;
	area: Area;
	date: string;
	message: string;
	state: EventState;
}
