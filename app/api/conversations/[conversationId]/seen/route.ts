import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusherServer";

interface IParams {
	conversationId?: string;
}

export async function POST(
	request: Request,
	{ params }: { params: IParams } //este debe ser el segundo argumento
) {
	try {
		const currentUser = await getCurrentUser();
		const { conversationId } = params;

		// si no hay usuario o no hay id o no hay email se devuelve un error
		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// encontrar the existing conversation
		const conversation = await prisma.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				messages: {
					include: {
						seen: true,
					},
				},
				users: true,
			},
		});

		if (!conversation) {
			return new NextResponse("Invalid ID", { status: 400 });
		}

		// find the last message
		const lastMessage = conversation.messages[conversation.messages.length - 1];

		if (!lastMessage) {
			return NextResponse.json(conversation);
		}

		// Update seen of last message
		const updatedMessage = await prisma.message.update({
			where: {
				id: lastMessage.id,
			},
			// incluir las relaciones
			include: {
				sender: true,
				seen: true,
			},
			// especificar los cambios que se van a hacer
			data: {
				seen: {
					// conect se usa para conectar el mensaje actual con el usuario actual
					connect: {
						id: currentUser.id,
					},
				},
			},
		});

		// Update all connections with new seen
		await pusherServer.trigger(currentUser.email, "conversation:update", {
			id: conversationId,
			messages: [updatedMessage],
		});

		// If user has already seen the message, no need to go further
		if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
			return NextResponse.json(conversation);
		}

		// Update last message seen
		await pusherServer.trigger(
			conversationId!,
			"message:update",
			updatedMessage
		);

		return NextResponse.json(updatedMessage);
	} catch (error: any) {
		console.log(error, "ERROR_MESSAGES_SEEN");
		return new NextResponse("Internal Error", { status: 500 });
	}
}
