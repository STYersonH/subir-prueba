//"use client"; // remover por que muestra un hydration error

//import { signOut } from "next-auth/react";
import React from "react";
import EmptyState from "../components/EmptyState";

const Users = () => {
	return (
		<div className="hidden lg:block lg:pl-80 h-full">
			<EmptyState />
		</div>
	);
};

export default Users;
