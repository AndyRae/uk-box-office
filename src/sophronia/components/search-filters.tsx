'use client';

import { Distributor } from 'interfaces/Distributor';
import { Country } from 'interfaces/Country';
import { toTitleCase } from 'lib/utils/toTitleCase';
import { Button } from 'components/ui/button-new';
import { Slider } from 'components/ui/slider';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from 'components/ui/collapsible';

import Select from 'react-select';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

type SelectOption = {
	value: string;
	label: string;
};

const mapToValues = (array: any[]) => {
	return array.map((item) => ({
		value: item.id.toString(),
		label: toTitleCase(item.name),
	}));
};

export const SearchFilters = ({
	query,
	distributors,
	countries,
	maxGross,
}: {
	query: string;
	distributors: Distributor[];
	countries: Country[];
	maxGross: number;
}) => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	const [selectedDist, setDistributors] = useState<SelectOption[]>([]);
	const [selectedCountry, setCountry] = useState<SelectOption[]>([]);
	const [selectedMin, setMin] = useState<number[]>();
	const [selectedMax, setMax] = useState<number[]>();

	const isFilterActive =
		selectedDist.length > 0 ||
		selectedCountry.length > 0 ||
		selectedMin ||
		selectedMax;

	// Run on start to set state, if already filtered.
	useEffect(() => {
		const distributorIds = searchParams
			.get('distributor')
			?.split(',')
			.filter(Boolean);
		if (distributorIds) {
			setDistributors(mapToValues(distributors));
		}

		const countryIds = searchParams.get('country')?.split(',').filter(Boolean);

		if (countryIds) {
			const selected = countries.filter((country) =>
				countryIds.includes(country.id.toString())
			);
			setCountry(mapToValues(selected));
		}

		const minBox = searchParams.get('min_box');
		const maxBox = searchParams.get('max_box');

		minBox ?? setMin([Number(minBox)]);
		maxBox ?? setMin([Number(maxBox)]);
	}, []);

	// map to values
	const distOptions = mapToValues(distributors);
	const countryOptions = mapToValues(countries);

	// Fetch data when an option is selected
	const handleOptionChange = async (data: any) => {
		setDistributors(data);
	};
	const handleSelectCountry = async (data: any) => {
		setCountry(data);
	};

	const handleFilter = async () => {
		// Add Ids to the URL
		const distIds = selectedDist.map((distributor) => distributor.value);
		const countryIds = selectedCountry.map((country) => country.value);

		const queryParams = new URLSearchParams();
		queryParams.append('q', query);

		if (distIds.length > 0) {
			queryParams.append('distributor', distIds.join(','));
		}

		if (countryIds.length > 0) {
			queryParams.append('country', countryIds.join(','));
		}

		if (selectedMin) {
			if (maxGross != selectedMin[0]) {
				queryParams.append('min_box', selectedMin[0].toString());
			}
		}

		if (selectedMax) {
			if (maxGross != selectedMax[0]) {
				queryParams.append('max_box', selectedMax[0].toString());
			}
		}

		const url = `${pathName}?${queryParams.toString()}`;
		router.push(url);
	};

	const handleClearFilter = async () => {
		setDistributors([]);
		setCountry([]);
		setMax(undefined);
		router.push(pathName + `?q=${query}`);
	};

	return (
		<div className='flex flex-wrap pb-4 gap-4'>
			<div className='flex flex-wrap gap-4'>
				<Select
					isMulti
					value={selectedDist}
					onChange={handleOptionChange}
					options={distOptions}
					className='compare-select-container w-64'
					classNamePrefix='compare-select'
					inputId='compare-select'
					instanceId='compare-select'
					noOptionsMessage={() => 'Distributors...'}
					placeholder='Filter Distributors'
				/>
				<Select
					isMulti
					value={selectedCountry}
					onChange={handleSelectCountry}
					options={countryOptions}
					className='compare-select-container w-64'
					classNamePrefix='compare-select'
					inputId='compare-select'
					instanceId='compare-select'
					noOptionsMessage={() => 'Countries...'}
					placeholder='Filter Countries'
				/>
			</div>

			<div className='flex flex-wrap gap-4'>
				<div className='flex flex-col items-center'>
					<div className='text-sm font-medium'>Minimum Box Office</div>
					<Slider
						className='w-32'
						onValueChange={setMin}
						defaultValue={[0]}
						max={maxGross}
						step={1}
					/>
					<div className='text-sm font-medium'>
						£{selectedMin ? selectedMin?.toLocaleString() : 0}
					</div>
				</div>
				<div className='flex flex-col items-center'>
					<div className='text-sm font-medium'>Maximum Box Office</div>
					<Slider
						className='w-32'
						onValueChange={setMax}
						defaultValue={[maxGross]}
						max={maxGross}
						step={1}
					/>
					<div className='text-sm font-medium'>
						£
						{selectedMax
							? selectedMax?.toLocaleString()
							: maxGross.toLocaleString()}
					</div>
				</div>
			</div>

			<div className='flex flex-wrap gap-4'>
				<Button
					onClick={handleFilter}
					variant={'outline'}
					disabled={!isFilterActive}
				>
					Apply
				</Button>
				<Button onClick={handleClearFilter} variant={'outline'}>
					Clear
				</Button>
			</div>
		</div>
	);
};
