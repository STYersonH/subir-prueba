import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusherServer";

interface IParams {
	conversationId: string;
}

export async function DELETE(
	request: Request,
	{ params }: { params: IParams }
) {
	try {
		const { conversationId } = params;
		const currentUser = await getCurrentUser();

		if (!currentUser?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Para eliminar conversacion de todos los usuarios, de su sidebar
		const existingConversation = await prisma.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				users: true,
			},
		});

		if (!existingConversation) {
			return new NextResponse("Invalid ID", { status: 400 });
		}

		const deletedConversation = await prisma.conversation.deleteMany({
			where: {
				id: conversationId,
				userIds: {
					hasSome: [currentUser.id],
				},
			},
		});

		// se usara existingConversation porque deletedConversation ya no existe
		existingConversation.users.forEach((user) => {
			if (user.email) {
				pusherServer.trigger(
					user.email,
					"conversation:remove",
					existingConversation
				);
			}
		});

		return NextResponse.json(deletedConversation);
	} catch (error: any) {
		console.log(error, "ERROR_CONVERSATION_DELETE");
		return new NextResponse("Internal Errorr", { status: 500 });
	}
}
