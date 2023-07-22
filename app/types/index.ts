// Se definen los tipos de FullMessageType y FullConversationType para que el editor de código pueda identificar las propiedades de los objetos que se retornan en la consulta a la base de datos.

import { Conversation, Message, User } from "@prisma/client";

export type FullMessgeType = Message & {
	sender: User;
	seen: User[];
};

export type FullConversationType = Conversation & {
	users: User[];
	messages: FullMessgeType[];
};
