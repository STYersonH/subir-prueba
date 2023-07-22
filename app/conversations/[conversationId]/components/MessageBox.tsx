"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessgeType } from "@/app/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
	data: FullMessgeType;
	isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
	const session = useSession(); // useSession para obtener el usuario logueado
	const [imageModalOpen, setImageModalOpen] = useState(false); // para el modal de la imagen

	// comparar el email de la sesion con el email del mensaje
	const isOwn = session?.data?.user?.email === data?.sender?.email;
	const seenList = (data.seen || []) // si data.seen es undefined, se asigna un array vacio, asi no da error
		.filter((user) => user.email !== data?.sender?.email) // filtrar los usuarios que no sean el usuario logueado
		.map((user) => user.name) // mapear los usuarios para obtener solo el nombre
		.join(", "); // unir los nombres con una coma -> Antonio, Mark, John, ...

	const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
	const avatar = clsx(isOwn && "order-2");
	const body = clsx("flex flex-col gap-2", isOwn && "items-end");
	const message = clsx(
		"text-sm w-fit overflow-hidden",
		isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
		data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
	);

	return (
		<div className={container}>
			<div className={avatar}>
				<Avatar user={data.sender} />
			</div>
			<div className={body}>
				<div className="flex item-center gap-1">
					{/* nombre */}
					<div className="text-sm text-gray-500">{data.sender.name}</div>
					{/* hora de envio */}
					<div className="text-xs text-gray-400">
						{format(new Date(data.createdAt), "p")}
					</div>
				</div>
				<div className={message}>
					<ImageModal
						src={data.image}
						isOpen={imageModalOpen}
						onClose={() => setImageModalOpen(false)}
					/>
					{data.image ? (
						<Image
							onClick={() => setImageModalOpen(true)}
							alt="Image"
							height="288"
							width="288"
							src={data.image}
							className="object-cover cursor-pointer hover:scale-110 transition translate"
						/>
					) : (
						<div>{data.body}</div>
					)}
				</div>
				{isLast && isOwn && seenList.length > 0 && (
					<div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
				)}
			</div>
		</div>
	);
};

export default MessageBox;
