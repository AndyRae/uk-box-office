import { Outlet } from "react-router-dom";
import { Sidebar } from "./ui/Sidebar";

export const Layout = () => {
	return (
		<div class="flex flex-no-wrap h-screen">
			<Sidebar />

			<div class="container mx-auto py-10 h-64 md:w-4/5 w-11/12 px-6">
        <Outlet />
			</div>
		</div>
	);
}
