'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Select from 'react-select';

import { Distributor } from 'interfaces/Distributor';
import { Country } from 'interfaces/Country';

import { toTitleCase } from 'lib/helpers/toTitleCase';

import { Icons } from 'components/icons';
import { Button } from 'components/ui/button-new';
import { Slider } from 'components/ui/slider';
import {
	Select as SelectWrap,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from 'components/ui/select';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from 'components/ui/collapsible';

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

	const FilterIcon = Icons['chevronDown'];

	const [selectedDist, setDistributors] = useState<SelectOption[]>([]);
	const [selectedCountry, setCountry] = useState<SelectOption[]>([]);
	const [selectedMinBox, setMinBox] = useState<number[]>();
	const [selectedMaxBox, setMaxBox] = useState<number[]>();
	const [selectedMinYear, setMinYear] = useState<number[]>();
	const [selectedMaxYear, setMaxYear] = useState<number[]>();
	const [selectedSort, setSort] = useState<string>();

	// Run on start to set state, if already filtered.
	useEffect(() => {
		const sort = searchParams.get('sort');
		sort && setSort(sort);

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
		const filterMappings = [
			{ filter: selectedSort, param: 'sort' },
			{
				filter: selectedDist,
				param: 'distributor',
				mapFn: (filter: SelectOption[]) => filter.map((d) => d.value),
			},
			{
				filter: selectedCountry,
				param: 'country',
				mapFn: (filter: SelectOption[]) => filter.map((c) => c.value),
			},
			{ filter: selectedMinBox, param: 'min_box' },
			{ filter: selectedMaxBox, param: 'max_box' },
			{ filter: selectedMinYear, param: 'min_year' },
			{ filter: selectedMaxYear, param: 'max_year' },
		];

		const queryParams = new URLSearchParams(searchParams);

		// Apply filters to queryParams based on properties.
		filterMappings.forEach(({ filter, param, mapFn }) => {
			if (filter) {
				if (mapFn && filter.length > 0) {
					const mappedFilter = mapFn(filter);
					queryParams.set(param, mappedFilter.join(','));
				} else if (Array.isArray(filter) && filter.length > 0) {
					queryParams.set(param, filter[0].toString());
				} else if (!Array.isArray(filter)) {
					queryParams.set(param, filter);
				}
			} else {
				queryParams.delete(param);
			}
		});

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
		<div className='flex flex-col pb-4 gap-4'>
			<div className='flex flex-wrap gap-4'>
				<SortSelect def='Name Ascending' setSort={setSort} />

				<Button onClick={handleFilter} variant={'default'}>
					Apply
				</Button>
				<Button onClick={handleClearFilter} variant={'outline'}>
					Clear
				</Button>
			</div>

			<Collapsible>
				<CollapsibleTrigger>
					<div className='flex'>
						Filters
						<FilterIcon className='h-6 w-6' />
					</div>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<div className='flex flex-col gap-6 pb-6'>
						<div className='flex flex-wrap gap-4 pt-6'>
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
							<BoxOfficeFilters
								selectedMinBox={selectedMinBox}
								setMinBox={setMinBox}
								selectedMaxBox={selectedMaxBox}
								setMaxBox={setMaxBox}
								maxGross={maxGross}
							/>

							<div className='border-r border-gray-300 pr-4'></div>

							<YearFilters
								selectedMinYear={selectedMinYear}
								setMinYear={setMinYear}
								selectedMaxYear={selectedMaxYear}
								setMaxYear={setMaxYear}
							/>
						</div>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

const SortSelect = ({
	setSort,
	def,
}: {
	setSort: (value: string) => void;
	def: any;
}) => {
	return (
		<SelectWrap onValueChange={setSort}>
			<SelectTrigger className='w-[240px]'>
				<SelectValue placeholder={def} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Sort</SelectLabel>
					<SelectItem value='asc_name'>Name Ascending</SelectItem>
					<SelectItem value='desc_name'>Name Descending</SelectItem>
					<SelectItem value='asc_box'>Box Office Low to High</SelectItem>
					<SelectItem value='desc_box'>Box Office High to Low</SelectItem>
				</SelectGroup>
			</SelectContent>
		</SelectWrap>
	);
};

const YearFilters = ({
	selectedMinYear,
	setMinYear,
	selectedMaxYear,
	setMaxYear,
}: {
	selectedMinYear?: number[];
	setMinYear: (value: number[]) => void;
	selectedMaxYear?: number[];
	setMaxYear: (value: number[]) => void;
}) => {
	const now = new Date().getFullYear();
	return (
		<>
			<SliderWrapper
				title='Minimum Year'
				label={selectedMinYear ? selectedMinYear : 1980}
				onValueChange={setMinYear}
				defaultValue={[1980]}
				min={1980}
				max={selectedMaxYear ? selectedMaxYear[0] : now}
			/>

			<SliderWrapper
				title='Maximum Year'
				label={selectedMaxYear ? selectedMaxYear : now}
				onValueChange={setMaxYear}
				defaultValue={[now]}
				min={selectedMinYear ? selectedMinYear[0] : 1981}
				max={now}
			/>
		</>
	);
};

const BoxOfficeFilters = ({
	selectedMinBox,
	setMinBox,
	selectedMaxBox,
	setMaxBox,
	maxGross,
}: {
	selectedMinBox?: number[];
	setMinBox: (value: number[]) => void;
	selectedMaxBox?: number[];
	setMaxBox: (value: number[]) => void;
	maxGross: number;
}) => {
	return (
		<>
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
		</>
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
		<div className='flex flex-col items-center gap-2'>
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
