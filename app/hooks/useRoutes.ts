// se usa para obtener una lista de rutas para la navegación
// para proveer una lista de rutas para la navegación a diferentes partes de la aplicación

import { useMemo } from "react";
import { usePathname } from "next/navigation"; // para obtener la ruta actual
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";

const useRoutes = () => {
	const pathname = usePathname();
	const { conversationId } = useConversation();

	const routes = useMemo(
		() => [
			{
				label: "Chat", //una etiqueta
				href: "/conversations", // una ruta
				icon: HiChat, // un icono
				active: pathname === "/conversations" || !!conversationId, // un booleano para determinar si la ruta está activa
			},
			{
				label: "Users",
				href: "/users",
				icon: HiUsers,
				active: pathname === "/users",
			},
			{
				label: "Logout",
				href: "#",
				onClick: () => signOut(), // una función para ejecutar cuando se hace clic en la ruta
				// onClick: (): void => {
				//   signOut();
				//   return undefined;
				// },
				icon: HiArrowLeftOnRectangle,
			},
		],
		[pathname, conversationId]
	);

	return routes;
};

export default useRoutes;
