"use client";

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
	label: string;
	id: string;
	type?: string;
	required?: boolean;
	// register es de tipo UseFormRegister<FieldValues> para registrar los inputs del formulario
	// register es una funcion que se usa para registrar los inputs del formulario, toma un objeto de tipo FieldValues como argumento
	register: UseFormRegister<FieldValues>;
	errors: FieldErrors;
	disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
	label,
	id,
	type = "text",
	required,
	register,
	errors,
	disabled,
}) => {
	return (
		<div>
			<label
				htmlFor={id}
				className="block text-sm font-medium leading-6 text-gray-900"
			>
				{label}
			</label>
			<div className="mt-2">
				<input
					type={type}
					id={id}
					autoComplete={id}
					disabled={disabled}
					// {...register(id, { required: required })}
					{...register(id, { required })} //para registrar el campo de entrada en el formulario
					// id y el objeto de opciones para definir las reglas de validacion (el campo es obligatorio o no)
					className={clsx(
						// clsx sirve para concatenar y condicionar clases de css
						`
						form-input
						block
						w-full
						rounded-md
						border-0
						py-1.5
						text-gray-900
						shadow-sm
						ring-1 
						ring-inset
						ring-gray-300
						placeholder:text-gray-400
						focus:ring-2
						focus:ring-inset
						focus:ring-sky-600
						sm:text-sm
						sm:leading-6`,
						errors[id] && "focus:ring-rose-500",
						disabled && "opacity-50 cursor-default"
					)}
				/>
			</div>
		</div>
	);
};

export default Input;
