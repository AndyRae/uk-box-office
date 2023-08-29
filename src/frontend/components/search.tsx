'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';

type SearchbarProps = {
	placeholder?: string;
	value?: string;
};

/**
 * @description Searchbar component
 * Search is primitive, just redirects to the search page where the api gets the query.
 * @param {String} placeholder - Placeholder text
 * @param {String} value - Value of the searchbar
 * @returns {JSX.Element}
 * @example
 * <Searchbar placeholder='Search' value={null} />
 */
export const Searchbar = ({
	placeholder = 'Search...',
	// @ts-ignore
	value = null,
}: SearchbarProps): JSX.Element => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const onSubmit = (data: any) => handleSearch(data);
	const router = useRouter();

	const handleSearch = (data: any) => {
		router.push(`/search?q=${data.Search}`);
	};

	const Icon = Icons['search'];

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className='flex mt-2.5'>
				<div className='relative w-full'>
					<Input
						type='search'
						id='search'
						placeholder={placeholder}
						{...register('Search', {})}
						required
						minLength={3}
					/>
					<button
						type='submit'
						aria-label='Search'
						className='absolute top-0 right-0 p-2 text-sm font-medium text-white rounded-r-lg'
					>
						<Icon className='h-5 w-5' />
					</button>
				</div>
			</div>
		</form>
	);
};
