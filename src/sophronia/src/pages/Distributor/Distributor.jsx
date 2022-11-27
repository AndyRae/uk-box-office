import { useDistributorFilms } from '../../api/distributors';
import { useParams } from 'react-router-dom';
import { Suspense, useState, useEffect } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { Pagination } from '../../components/ui/Pagination';
import { paginate } from '../../utils/pagination';
import { FilmList } from '../../components/Film/FilmList';
import { PageTitle } from '../../components/ui/PageTitle';

export const DistributorPage = () => {
	const { slug } = useParams();
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;

	const { data, error } = useDistributorFilms(slug, pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	useEffect(() => {
		document.title = `${data?.distributor.name} - UK Box Office Data`;
	}, []);

	return (
		<>
			<PageTitle>{data.distributor.name}</PageTitle>
			<FilmList films={data} pageIndex={pageIndex} />
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
};

export const Distributor = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<DistributorPage />
		</Suspense>
	);
};
