"use client";

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import Select from "@/app/components/inputs/Select";
import Input from "@/app/components/inputs/input";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface GroupChatModalProps {
	isOpen?: boolean;
	onClose: () => void;
	users: User[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
	isOpen,
	onClose,
	users,
}) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register, // para registrar los campos del formulario que en este caso son name y members
		handleSubmit, // para manejar la presentacion de los datos del formulario, se toma una funcion que se ejecuta cuando se envia el formulario
		setValue, // para establecer el valor de los campos del formulario
		watch, // para observar los cambios en los campos del formulario, la funcion toma como parametro el nombre del campo a observar y retorna el valor actual del campo
		formState: { errors },
	} = useForm<FieldValues>({
		// especifica los valores por defecto de los campos
		defaultValues: {
			name: "",
			members: [],
		},
	});

	const members = watch("members"); // observa los cambios en el campo members
	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		setIsLoading(true);

		axios
			.post("/api/conversations", {
				...data,
				isGroup: true,
			})
			.then(() => {
				router.refresh(); // recarga la pagina
				onClose(); // cierra el modal
			})
			.catch(() => toast.error("Something went wrong!"))
			.finally(() => setIsLoading(false));
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* space-y-12 : espacio entre los elementos hijos */}
				<div className="space-y-12">
					<div className="border-b border-gray-900/10 pb-12">
						<h2 className="text-base font-semibold leading-7 text-gray-900">
							Create a group chat
						</h2>
						<p className="mt-1 text-sm leading-6 gap-y-8">
							<Input
								register={register}
								label="Name"
								id="name"
								disabled={isLoading}
								required
								errors={errors}
							/>
							<Select
								disabled={isLoading}
								label="Members"
								options={users.map((user) => ({
									value: user.id,
									label: user.name,
								}))}
								onChange={(value) =>
									setValue("members", value, {
										shouldValidate: true,
									})
								}
								value={members}
							/>
						</p>
					</div>
				</div>

				<div className="mt-6 flex items-center justify-end gap-x-6">
					<Button
						disabled={isLoading}
						onClick={onClose}
						type="button"
						secundary
					>
						Cancel
					</Button>
					<Button disabled={isLoading} type="submit">
						Create
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default GroupChatModal;
