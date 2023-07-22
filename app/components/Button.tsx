"use client";

import clsx from "clsx";

interface ButtonProps {
	type?: "button" | "submit" | "reset" | undefined;
	fullWidth?: boolean;
	children?: React.ReactNode;
	onClick?: () => void;
	secundary?: boolean;
	danger?: boolean;
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	type,
	fullWidth,
	children,
	onClick,
	secundary,
	danger,
	disabled,
}) => {
	return (
		<button
			onClick={onClick}
			type={type}
			disabled={disabled}
			className={clsx(
				`
				flex
				justify-center
				rounded-md
				px-3
				py-2
				text-sm
				font-semibold
				focus-visible:outline
				focus-visible:outline-2
				focus-visible:outline-offset-2
      `,
				disabled && "opacity-50 cursor-default", //cuando se de click, se carga la solicitud y el boton se desactiva
				fullWidth && "w-full",
				secundary ? "text-gray-900" : "text-white",
				danger &&
					"bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
				!secundary &&
					!danger &&
					"bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600" //focus-visible es con teclado
			)}
		>
			{children}
		</button>
	);
};

export default Button;
