import { NextApiRequest, NextApiResponse } from "next"; // para definir los tipos de los parámetros de la función handler.
import { getServerSession } from "next-auth"; // para obtener la sesión del usuario.

import { pusherServer } from "@/app/libs/pusherServer"; // para autorizar al usuario en el canal de Pusher.
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // para configurar la autenticacion de NextAuth.

export default async function handler(
	request: NextApiRequest, // objeto que representa la solicitud HTTP entrante.
	response: NextApiResponse // la respuesta HTTP que se enviará al cliente.
) {
	// se obtiene la sesión del usuario en el servidor
	const session = await getServerSession(request, response, authOptions);

	// si no se encuentra la sesión del usuario, se devuelve un error 401
	if (!session?.user?.email) {
		return response.status(401);
	}

	// datos para usarlos en authorizeChannel
	const socketId = request.body.socket_id;
	const channel = request.body.channel_name;
	// datos del usuario
	const data = {
		user_id: session.user.email,
	};

	// se autoriza al usuario para acceder al canal de Pusher
	const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

	// se devuelve la respuesta de autorización
	return response.send(authResponse);
}
