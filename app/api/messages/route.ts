import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"; // si no se imoporta prisma, se puede romper en produccion
import { pusherServer } from "@/app/libs/pusherServer";

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const { message, image, conversationId } = body;

		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const newMessage = await prisma.message.create({
			include: {
				seen: true,
				sender: true,
			},
			data: {
				body: message,
				image: image,
				conversation: {
					connect: {
						id: conversationId,
					},
				},
				sender: {
					connect: {
						id: currentUser.id,
					},
				},
				seen: {
					connect: {
						id: currentUser.id, // quien vio el mensaje inmediatamente es quien lo envio
					},
				},
			},
		});

		const updatedConversation = await prisma.conversation.update({
			where: {
				id: conversationId,
			},
			data: {
				lastMessageAt: new Date(),
				messages: {
					connect: {
						id: newMessage.id,
					},
				},
			},
			include: {
				users: true,
				messages: {
					include: {
						seen: true,
					},
				},
			},
		});

		// console.log("newMessage", newMessage);

		// se envia el evento identificado por conversationId y se nombra messages:new
		// newMessage es el payload del evento o el objeto que se envia como datos del evento
		await pusherServer.trigger(conversationId, "messages:new", newMessage);
		// event (parametro 2) : debe ser una cadena de texto significativo para el evento enviado
		// cada usuario que este escuchando este canal recibira la actualizacion

		// obtenemos el ultimo mensaje
		const lastMessage =
			updatedConversation.messages[updatedConversation.messages.length - 1];

		// se creara la conversacion en tiempo real para cada uno de los usuarios si es un grupo
		await updatedConversation.users.map((user) => {
			pusherServer.trigger(user.email!, "conversation:update", {
				id: conversationId,
				messages: [lastMessage],
			});
		});

		return NextResponse.json(newMessage);
	} catch (error: any) {
		console.log(error, "ERROR_MESSAGES");
		return new NextResponse("InternalError", { status: 500 });
	}
}
