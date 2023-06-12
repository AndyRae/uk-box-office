'use client';

import { Distributor } from 'interfaces/Distributor';
import { Country } from 'interfaces/Country';
import { toTitleCase } from 'lib/utils/toTitleCase';
import { Button } from 'components/ui/button-new';
import { Slider } from 'components/ui/slider';

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
	const [selectedMinBox, setMinBox] = useState<number[]>();
	const [selectedMaxBox, setMaxBox] = useState<number[]>();
	const [selectedMinYear, setMinYear] = useState<number[]>();
	const [selectedMaxYear, setMaxYear] = useState<number[]>();

	const isFilterActive =
		selectedDist.length > 0 ||
		selectedCountry.length > 0 ||
		selectedMinBox ||
		selectedMaxBox ||
		selectedMinYear ||
		selectedMaxYear;

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
		const minYear = searchParams.get('min_year');
		const maxYear = searchParams.get('max_year');

		maxBox && console.log(Number(maxBox));

		minBox && setMinBox([Number(minBox)]);
		maxBox && setMaxBox([Number(maxBox)]);
		minYear && setMinYear([Number(minYear)]);
		maxYear && setMaxYear([Number(maxYear)]);
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

		// Preserve any existing params
		for (const [key, value] of searchParams.entries()) {
			queryParams.append(key, value);
		}

		if (distIds.length > 0) {
			queryParams.delete('distributor');
			queryParams.append('distributor', distIds.join(','));
		}

		if (countryIds.length > 0) {
			queryParams.delete('country');
			queryParams.append('country', countryIds.join(','));
		}

		if (selectedMinBox) {
			if (selectedMinBox[0] != 0) {
				queryParams.delete('min_box');
				queryParams.append('min_box', selectedMinBox[0].toString());
			}
		}

		if (selectedMaxBox) {
			if (selectedMaxBox[0] != maxGross) {
				queryParams.delete('max_box');
				queryParams.append('max_box', selectedMaxBox[0].toString());
			}
		}

		if (selectedMinYear) {
			queryParams.delete('min_year');
			queryParams.append('min_year', selectedMinYear[0].toString());
		}

		if (selectedMaxYear) {
			queryParams.delete('max_year');
			queryParams.append('max_year', selectedMaxYear[0].toString());
		}

		const url = `${pathName}?${queryParams.toString()}`;
		router.push(url);
	};

	const handleClearFilter = async () => {
		setDistributors([]);
		setCountry([]);
		setMaxBox(undefined);
		setMinBox(undefined);
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
				<SliderWrapper
					title='Minimum Box Office'
					label={selectedMinBox ? selectedMinBox?.toLocaleString() : 0}
					onValueChange={setMinBox}
					defaultValue={[0]}
					min={0}
					max={selectedMaxBox ? selectedMaxBox[0] : maxGross - 1}
				/>
				<SliderWrapper
					title='Maximum Box Office'
					label={
						selectedMaxBox
							? selectedMaxBox?.toLocaleString()
							: maxGross.toLocaleString()
					}
					onValueChange={setMaxBox}
					defaultValue={[maxGross]}
					min={selectedMinBox ? selectedMinBox[0] : 1}
					max={maxGross}
				/>
			</div>

			<div className='flex flex-wrap gap-4'>
				<SliderWrapper
					title='Minimum Year'
					label={selectedMinYear ? selectedMinYear : 1980}
					onValueChange={setMinYear}
					defaultValue={[1980]}
					min={1980}
					max={selectedMaxYear ? selectedMaxYear[0] : 2023}
				/>
				<SliderWrapper
					title='Maximum Year'
					label={selectedMaxYear ? selectedMaxYear : 2023}
					onValueChange={setMaxYear}
					defaultValue={[2023]}
					min={selectedMinYear ? selectedMinYear[0] : 1981}
					max={2023}
				/>
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

const SliderWrapper = ({
	title,
	label,
	onValueChange,
	defaultValue,
	min,
	max,
	step = 1,
}: {
	title: string;
	label: string | any;
	onValueChange: (value: number[]) => void;
	defaultValue: number[];
	min: number;
	max: number;
	step?: number;
}) => {
	return (
		<div className='flex flex-col items-center'>
			<div className='text-sm font-medium'>{title}</div>
			<Slider
				className='w-32'
				onValueChange={onValueChange}
				defaultValue={defaultValue}
				min={min}
				max={max}
				step={step}
			/>
			<div className='text-sm font-medium'>{label}</div>
		</div>
	);
};
