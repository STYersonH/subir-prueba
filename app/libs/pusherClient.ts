// import PusherServer from "pusher";
// import PusherClient from "pusher-js";
import PusherClient from "pusher-js";

// La instancia se configura con la clave para conectarse a un canal de Pusher
// y recibir eventos en tiempo real
export const pusherClient = new PusherClient(
	process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
	{
		channelAuthorization: {
			endpoint: "/api/pusher/auth",
			transport: "ajax",
		},
		cluster: "us2",
	}
);
