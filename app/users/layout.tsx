// Layout for all users

import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import getUsers from "../actions/getUsers";
import UserList from "./components/UserList";

// es async por que fetch users directamente desde la base de datos
const UserLayout = async ({ children }: { children: React.ReactNode }) => {
	const users = await getUsers();
	return (
		<Sidebar>
			<div className="h-full">
				<UserList items={users} />
				{children}
			</div>
		</Sidebar>
	);
};

export default UserLayout;
