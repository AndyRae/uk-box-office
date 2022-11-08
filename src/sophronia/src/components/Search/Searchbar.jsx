import { useForm } from 'react-hook-form';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

export const Searchbar = () => {
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
						placeholder='Search'
						class='block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						{...register('Search', {})}
						required
					/>
					<button
						type='submit'
						class='absolute top-0 right-0 p-2 text-sm font-medium text-white bg-blue-700 rounded-r-lg border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
					>
						{/* <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> */}
						<AiOutlineSearch className='h-5 w-5' />
					</button>
				</div>
			</div>
		</form>
	);
};
