import { useEffect, useState } from "react";
import useActiveList from "./useActiveList";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "../libs/pusherClient";

const useActiveChannel = () => {
	const { set, add, remove } = useActiveList();
	const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

	useEffect(() => {
		let channel = activeChannel;

		if (!channel) {
			channel = pusherClient.subscribe("presence-messenger");
			setActiveChannel(channel);
		}

		// almacenar usuarios activos en el estado local
		channel.bind("pusher:subscription_succeeded", (members: Members) => {
			const initialMembers: string[] = [];

			members.each((member: Record<string, any>) => {
				initialMembers.push(member.id);
			});
			// se actualiza en el global store el estado de la lista de usuarios activos
			set(initialMembers);
		});

		// para usuarios nuevos o agregados recientemente
		channel.bind("pusher:member_added", (member: Record<string, any>) => {
			add(member.id);
		});

		// para cuando se elimine un usuario
		channel.bind("pusher:member_removed", (member: Record<string, any>) => {
			remove(member.id);
		});

		return () => {
			if (activeChannel) {
				pusherClient.unsubscribe("presence-messenger");
				setActiveChannel(null);
			}
		};
	}, [activeChannel, add, remove, set]);
};

export default useActiveChannel;
