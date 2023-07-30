import { Distributor } from './Distributor';

export default interface MarketShare {
	distributor: Distributor;
	years: [
		{
			gross: number;
			market_share: number;
			year: number;
		}
	];
}
