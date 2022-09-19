import { Outlet } from "react-router-dom";

export const Layout = ({ children }) => {
	return (
		<div>
			{/* <Navbar /> */}

			<div><h1>Layout</h1></div>
			<div>
      <Outlet />
      </div>
		</div>
	);
}
