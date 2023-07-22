"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
	placeholder?: string;
	id: string;
	type?: string;
	required?: boolean;
	// funcion para registrar un campo
	register: UseFormRegister<FieldValues>; // definiendose asi se asegura que el campo tenga la firma correcta para registrar campos de entrada con react-hook-form
	errors: FieldErrors;
}

const MessageInput: React.FC<MessageInputProps> = ({
	placeholder,
	id,
	type,
	required,
	register,
}) => {
	return (
		<div className="relative w-full">
			<input
				id={id}
				type={type}
				autoComplete={id}
				{...register(id, { required })}
				placeholder={placeholder}
				className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
			/>
		</div>
	);
};

export default MessageInput;
