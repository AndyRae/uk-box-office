import { Outlet } from "react-router-dom";
import { Sidebar } from "./ui/Sidebar";

export const Layout = () => {
	return (
		<div class="fixed flex w-full h-full">
			<Sidebar />

			<div class="flex-1 p-10 overflow-auto  bg-gray-50 dark:bg-gray-900  dark:text-white">
        <Outlet />
			</div>
		</div>
	);
}
