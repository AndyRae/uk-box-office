'use client';

import Select from 'react-select';
import { Distributor } from 'interfaces/Distributor';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toTitleCase } from 'lib/utils/toTitleCase';

type DistributorOption = {
	value: string;
	label: string;
};

export const SearchFilters = ({
	query,
	distributors,
}: {
	query: string;
	distributors: Distributor[];
}) => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	// map to values
	const options = distributors.map((distributor) => ({
		value: distributor.id,
		label: toTitleCase(distributor.name),
	}));

	// Fetch data when an option is selected
	const handleOptionChange = async (data: any) => {
		// Add Ids to the url
		const urlIds = data.map(
			(distributor: DistributorOption) => distributor.value
		);
		router.push(pathName + `?q=${query}&distributor=${urlIds}`);
	};

	return (
		<div className='flex flex-wrap mb-2 gap-y-4 items-center justify-center'>
			<Select
				isMulti
				onChange={handleOptionChange}
				options={options}
				className='compare-select-container'
				classNamePrefix='compare-select'
				inputId='compare-select'
				instanceId='compare-select'
				noOptionsMessage={() => 'Distributors...'}
			/>
		</div>
	);
};
