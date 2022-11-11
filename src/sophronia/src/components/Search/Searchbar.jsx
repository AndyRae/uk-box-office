import { useForm } from 'react-hook-form';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

export const Searchbar = ({ placeholder = 'Search', value = null }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const onSubmit = (data) => handleSearch(data);
	const navigate = useNavigate();

	// Search just redirects to the search page where api gets the query.
	// Super primitive, but it works.
	const handleSearch = (data) => {
		navigate(`/search?q=${data.Search}`);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className='flex mt-2.5'>
				<div className='relative w-full'>
					<input
						type='search'
						id='search'
						placeholder={placeholder}
						className='block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						{...register('Search', {})}
						value={''}
						required
					/>
					<button
						type='submit'
						className='absolute top-0 right-0 p-2 text-sm font-medium text-white bg-red-400 rounded-r-lg border-2 border-red-400 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300'
					>
						<AiOutlineSearch className='h-5 w-5' />
					</button>
				</div>
			</div>
		</form>
	);
};
