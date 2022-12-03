import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Forecast } from './pages/Flat/Forecast';
import { Films } from './pages/Film/Films';
import { Film } from './pages/Film/Film';
import { Distributor } from './pages/Distributor/Distributor';
import { Distributors } from './pages/Distributor/Distributors';
import { Countries } from './pages/Country/Countries';
import { Country } from './pages/Country/Country';
import { Time } from './pages/Time/Time';
import { All } from './pages/Time/All';
import { LastWeek } from './pages/Time/LastWeek';
import { MarketShareDistributor } from './pages/MarketShare/Distributor';
import { About } from './pages/Flat/About';
import { Contact } from './pages/Flat/Contact';
import { MainSearch } from './pages/Search';
import { TopFilms } from './pages/Flat/TopFilms';
import { OpenData } from './pages/Flat/OpenData';
import { NotFound } from './pages/Flat/NotFound';

export const Root = () => {
	return (
		<Routes>
			<Route path='/'>
				<Route element={<Layout />}>
					<Route index element={<Dashboard />} />

					{/* Flat pages */}
					<Route path='about' element={<About />} />
					<Route path='contact' element={<Contact />} />

					<Route path='search' element={<MainSearch />} />

					<Route path='forecast' element={<Forecast />} />
					<Route path='topfilms' element={<TopFilms />} />
					<Route path='opendata' element={<OpenData />} />

					<Route path='film'>
						<Route index element={<Films />} />
						<Route path=':slug'>
							<Route index element={<Film />} />
						</Route>
					</Route>

					<Route path='distributor'>
						<Route index element={<Distributors />} />
						<Route path=':slug'>
							<Route index element={<Distributor />} />
						</Route>
					</Route>

					<Route path='country'>
						<Route index element={<Countries />} />
						<Route path=':slug'>
							<Route index element={<Country />} />
						</Route>
					</Route>

					<Route path='week'>
						<Route index element={<LastWeek />} />
					</Route>

					<Route path='time'>
						<Route index element={<All />} />
						<Route path=':year'>
							<Route index element={<Time />} />
						</Route>

						<Route path=':year/m:month'>
							<Route index element={<Time />} />
						</Route>

						<Route path=':year/m:month/d:day'>
							<Route index element={<Time />} />
						</Route>

						<Route path=':year/q:quarter'>
							<Route index element={<Time />} />
						</Route>

						<Route path=':year/q:quarter/q:quarterend'>
							<Route index element={<Time />} />
						</Route>
					</Route>

					<Route path='marketshare'>
						<Route index element={<MarketShareDistributor />} />

						<Route path='distributor'>
							<Route index element={<MarketShareDistributor />} />
						</Route>
					</Route>
					<Route path='*' element={<NotFound />} />
				</Route>
			</Route>
		</Routes>
	);
};
