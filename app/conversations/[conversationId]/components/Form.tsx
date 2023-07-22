"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";

const Form = () => {
	const { conversationId } = useConversation();

	const {
		register, // registrar un campo y lo vincula con el objeto formState
		handleSubmit, // función que se ejecuta cuando se envía el formulario
		setValue, // función que permite establecer el valor de un campo
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			// valor por defecto del campo message
			message: "",
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		// establecer el valor del campo message a vacío
		// nombre del campo, valor, opciones para configurar el comportamiento de la funcion setValue
		setValue("message", "", { shouldValidate: true }); //shouldValidate: true para que se ejecute la validación del campo
		axios.post("/api/messages", {
			...data,
			conversationId: conversationId,
		});
	};

	const handleUpload = (result: any) => {
		axios.post("/api/messages", {
			image: result?.info?.secure_url,
			conversationId: conversationId,
		});
	};

	return (
		<div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
			{/* se usara el preset de cloudinary con el nombre "iurr7c1h" para cargar imagenes o videos en la nube */}
			<CldUploadButton
				options={{ maxFiles: 1 }}
				onUpload={handleUpload}
				uploadPreset="iurr7c1h"
			>
				<HiPhoto size={32} className=" text-sky-500" />
			</CldUploadButton>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className=" flex items-center gap-2 lg:gap-4 w-full"
			>
				<MessageInput
					id="message"
					register={register}
					errors={errors}
					required
					placeholder="Write a message"
				/>
				{/* el boton para que sea submit debe estar dentro del form */}
				<button
					type="submit"
					className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
				>
					<HiPaperAirplane size={18} className="text-white" />
				</button>
			</form>
		</div>
	);
};

export default Form;
