//import PusherServer from "pusher";
//import PusherClient from "pusher-js";
import PusherServer from "pusher";
// la instancia se configura con credenciales de Pusher para conectarse a un canal de Pusher
// y enviar eventos a dicho canal
export const pusherServer = new PusherServer({
	//. ! significa que las variables estan definidas y no so nulas, si una es nula se produce un error en tiempo de ejecucion
	appId: process.env.PUSHER_APP_ID!,
	key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
	secret: process.env.PUSHER_SECRET!,
	cluster: "us2", //!esto nunca debio estar en .env
	useTLS: true,
});
