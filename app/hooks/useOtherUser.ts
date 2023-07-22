import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (
	conversation: FullConversationType | { users: User[] }
) => {
	console.log("conversation users", conversation.users);

	const session = useSession();

	console.log("session email", session.data?.user?.email);

	const otherUser = useMemo(() => {
		const currentUserEmail = session.data?.user?.email;

		// obtener el usuario de la conversación que no sea el usuario actual
		const otherUser = conversation.users.filter(
			(user) => user.email !== currentUserEmail
		);

		//return otherUser; //retorna un arreglo de usuarios
		return otherUser[0];
	}, [session.data?.user?.email, conversation.users]);

	return otherUser;
};

export default useOtherUser;
