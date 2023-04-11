import { IconType } from 'react-icons';
import {
	AiOutlineMenu,
	AiOutlineClose,
	AiOutlineSearch,
	AiOutlineArrowDown,
} from 'react-icons/ai';
import { BiNetworkChart } from 'react-icons/bi';
import { BsListOl, BsFileEarmarkSpreadsheet } from 'react-icons/bs';
import {
	FaInfoCircle,
	FaEnvelope,
	FaGithub,
	FaFilm,
	FaGlobeEurope,
} from 'react-icons/fa';
import { FiChevronDown, FiDatabase } from 'react-icons/fi';
import { HiOutlineTicket } from 'react-icons/hi';
import {
	MdOutlineSpaceDashboard,
	MdOutlineAutoGraph,
	MdCompareArrows,
	MdOutlineErrorOutline,
	MdCheckCircleOutline,
} from 'react-icons/md';
import { RiSeedlingLine } from 'react-icons/ri';
import { TbActivityHeartbeat } from 'react-icons/tb';

export type Icon = IconType;

export const Icons = {
	menu: AiOutlineMenu,
	close: AiOutlineClose,
	network: BiNetworkChart,
	list: BsListOl,
	globe: FaGlobeEurope,
	database: FiDatabase,
	ticket: HiOutlineTicket,
	graph: MdOutlineAutoGraph,
	dashboard: MdOutlineSpaceDashboard,
	compare: MdCompareArrows,
	seedling: RiSeedlingLine,
	search: AiOutlineSearch,
	error: MdOutlineErrorOutline,
	success: MdCheckCircleOutline,
	arrowDown: AiOutlineArrowDown,
	spreadsheet: BsFileEarmarkSpreadsheet,
	github: FaGithub,
	info: FaInfoCircle,
	envelope: FaEnvelope,
	film: FaFilm,
	status: TbActivityHeartbeat,
	chevronDown: FiChevronDown,
};
