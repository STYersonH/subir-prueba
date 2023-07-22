import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
	const currentUser = await getCurrentUser();

	if (!currentUser?.id) {
		return [];
	}

	try {
		// findMany se usa para buscar varios registros en la base de datos
		const conversations = await prisma.conversation.findMany({
			orderBy: {
				lastMessageAt: "desc", // ordena los resultados por la propiedad lastMessage de forma descendente, por la fecha de su último mensaje
			},
			where: {
				userIds: {
					has: currentUser.id, // busca las conversaciones donde el usuario actual esté incluido en el array de userIds
				},
			},
			// para incluir relaciones en la consulta, se usa el objeto include
			// estas relaciones son utiles para obtener datos de otras tablas relacionadas
			include: {
				users: true, // los usuarios que participan en la conversación
				messages: {
					include: {
						sender: true, // the sender of the message
						seen: true, // the users who have seen the message
					},
				},
			},
		});

		return conversations;
	} catch (error: any) {
		return [];
	}
};

export default getConversations;
