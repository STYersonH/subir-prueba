"use client";

import { useEffect, useRef, useState } from "react";
import useConversation from "@/app/hooks/useConversation";
import { FullMessgeType } from "@/app/types";

import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusherClient";
import { find } from "lodash";

interface BodyProps {
	initialMessages: FullMessgeType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
	const [messages, setMessages] = useState(initialMessages);
	// bottomRef se usara para hacer scroll automatico al final del contenedor
	const bottomRef = useRef<HTMLDivElement>(null);

	const { conversationId } = useConversation();

	useEffect(() => {
		axios.post(`/api/conversations/${conversationId}/seen`);
	}, [conversationId]);

	useEffect(() => {
		// se suscribe al canal de conversacionId
		// se establece una conexion websocket con el servidor de pusher y comienza a recibir eventos en tiempo real del canal especificado
		pusherClient.subscribe(conversationId);

		// para desplazar el scroll al final del contenedor
		bottomRef?.current?.scrollIntoView();

		const messageHandler = (message: FullMessgeType) => {
			// cuando se recibe un nuevo mensaje alertamos a todos que hemos visto el mensaje
			axios.post(`/api/conversations/${conversationId}/seen`);
			// setMessages toma una funcion como argumento, esta funcion recibe el estado actual y retorna el nuevo estado
			setMessages((current) => {
				// si el mensaje ya esta en la lista no lo agregamos
				// para no duplicar mensajes
				if (find(current, { id: message.id })) {
					return current;
				}
				// si el mensaje no esta en la lista lo agregamos
				return [...current, message];
			});
			bottomRef?.current?.scrollIntoView();
		};

		const updateMessageHandler = (newMessage: FullMessgeType) => {
			setMessages((current) =>
				current.map((currentMessage) => {
					if (currentMessage.id === newMessage.id) {
						return newMessage;
					}

					return currentMessage;
				})
			);
		};

		pusherClient.bind("messages:new", messageHandler);
		pusherClient.bind("messages:update", updateMessageHandler);

		// cada vez que desmontamos debemos unsubscribe y unbind para evitar fugas de memoria
		return () => {
			pusherClient.unsubscribe(conversationId);
			pusherClient.unbind("messages:new", messageHandler);
			pusherClient.unbind("messages:update", updateMessageHandler);
		};
	}, [conversationId]);

	return (
		<div className="flex-1 overflow-y-auto ">
			{messages.map((message, i) => (
				<MessageBox
					isLast={i === messages.length - 1}
					key={message.id}
					data={message}
				/>
			))}
			<div ref={bottomRef} className="pt-24" />
		</div>
	);
};

export default Body;
