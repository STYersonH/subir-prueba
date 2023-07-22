import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusherServer";

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser();
		const body = await request.json();
		const {
			userId, //one to one conversation
			isGroup, //group conversation
			members,
			name, //group name chat
		} = body;

		if (!currentUser?.id || !currentUser?.email) {
			// status 401 : significa que no esta autorizado
			return new NextResponse("Unauthorized", { status: 400 });
		}

		if (isGroup && (!members || members.length < 2 || !name)) {
			return new NextResponse("Invalid data", { status: 400 });
		}

		if (isGroup) {
			const newConversation = await prisma.conversation.create({
				data: {
					name,
					isGroup,
					users: {
						connect: [
							// se conecta con los miembros del grupo y el usuario actual
							...members.map((member: { value: string }) => ({
								id: member.value,
							})),
							{ id: currentUser.id },
						],
					},
				},
				// completa los usuarios cuando obtiene la conversacion
				// con los ids se puede obtener todos los datos de los usuarios
				include: {
					users: true,
				},
			});

			// Update all connections with new conversation para grupos
			newConversation.users.forEach((user) => {
				if (user.email) {
					pusherServer.trigger(user.email, "conversation:new", newConversation);
				}
			});

			return NextResponse.json(newConversation);
		}

		const existingConversations = await prisma.conversation.findMany({
			where: {
				OR: [
					{
						userIds: {
							equals: [currentUser.id, userId],
						},
					},
					{
						userIds: {
							equals: [userId, currentUser.id],
						},
					},
				],
			},
		});

		const singleConversation = existingConversations[0];

		if (singleConversation) {
			return NextResponse.json(singleConversation);
		}

		const newConversation = await prisma.conversation.create({
			data: {
				users: {
					connect: [
						{
							id: currentUser.id,
						},
						{
							id: userId,
						},
					],
				},
			},
			include: {
				users: true,
			},
		});

		// Update all connections with new conversation para conversaciones individuales
		newConversation.users.map((user) => {
			if (user.email) {
				pusherServer.trigger(user.email, "conversation:new", newConversation);
			}
		});

		return NextResponse.json(newConversation);
	} catch (error) {
		// status 500 : significa que hubo un error interno
		return new NextResponse("Internal Error", { status: 500 });
	}
}
