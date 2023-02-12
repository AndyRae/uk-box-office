export interface EventState {
	Success: 'Success';
	Warning: 'Warning';
	Error: 'Error';
}

export interface Area {
	ETL: 'ETL';
	Forecast: 'Forecast';
	Archive: 'Archive';
}

export interface Event {
	id: number;
	area: Area;
	date: string;
	message: string;
	state: EventState;
}
