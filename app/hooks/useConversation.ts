// Se define un hook para obtener el id de la conversación actual

import { useParams } from "next/navigation"; // hook de next para obtener los parámetros de la url
import { useMemo } from "react"; //optimiza el rendimiento de la aplicación para evitar calcular un valor que no cambia entre renderizados
//Toma 2 args : la funcion de calculo que se ejecuta solo cuando algna dependencia cambia y la lista de dependencias

const useConversation = () => {
	const params = useParams(); //obtener los parámetros de la url

	// 2 args:
	// 1)la funcion que calcula el valor de retorno y la lista de dependencias
	// 2)la lista de dependencias que incluye los parámetros de la URL
	const conversationId = useMemo(() => {
		// si se proporciona un id de conversación, se devuelve el id de conversación
		if (!params?.conversationId) {
			return "";
		}
		return params.conversationId as string;
	}, [params?.conversationId]);

	// 2 args:
	// 1) La funcion para determinar si se proporciona un id de conversación
	// 2) La lista de dependencias que incluye el id de conversación
	const isOpen = useMemo(() => !!conversationId, [conversationId]); // !! convierte string en boolean

	// solo se retornara cada vez que cambie el id de conversación y el estado de isOpen
	return useMemo(
		() => ({
			isOpen,
			conversationId,
		}),
		[isOpen, conversationId]
	);
};

export default useConversation;
