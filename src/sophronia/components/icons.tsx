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
	FaFilm,
	FaGlobeEurope,
} from 'react-icons/fa';
import { FiDatabase } from 'react-icons/fi';
import { HiOutlineTicket } from 'react-icons/hi';
import {
	MdOutlineSpaceDashboard,
	MdOutlineAutoGraph,
	MdCompareArrows,
	MdOutlineErrorOutline,
	MdCheckCircleOutline,
} from 'react-icons/md';
import { RiSeedlingLine } from 'react-icons/ri';

export type Icon = IconType;

export const Icons = {
	Menu: AiOutlineMenu,
	Close: AiOutlineClose,
	Network: BiNetworkChart,
	List: BsListOl,
	Globe: FaGlobeEurope,
	Database: FiDatabase,
	Ticket: HiOutlineTicket,
	Graph: MdOutlineAutoGraph,
	Dashboard: MdOutlineSpaceDashboard,
	Compare: MdCompareArrows,
	Seedling: RiSeedlingLine,
	Search: AiOutlineSearch,
	Error: MdOutlineErrorOutline,
	Success: MdCheckCircleOutline,
	ArrowDown: AiOutlineArrowDown,
	Spreadsheet: BsFileEarmarkSpreadsheet,
	Info: FaInfoCircle,
	Envelope: FaEnvelope,
	Film: FaFilm,
};
