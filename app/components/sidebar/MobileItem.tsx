"use client";

import Link from "next/link";
import clsx from "clsx";

// esta interfaz permite definir el tipo de dato que se va a recibir en el componente
interface MobileItemProps {
	href: string;
	icon: any;
	active?: boolean;
	onClick: (() => Promise<undefined>) | undefined;
}

// React.FC<MobileItemProps> se usa para definir el tipo de dato que se va a recibir
// en este caso se va a recibir un objeto de tipo MobileItemProps que es una interfaz
const MobileItem: React.FC<MobileItemProps> = ({
	href,
	icon: Icon,
	active,
	onClick,
}) => {
	const handleClick = () => {
		if (onClick) {
			return onClick();
		}
	};

	return (
		<Link
			href={href}
			onClick={onClick}
			className={clsx(
				`group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100`,
				active && "bg-gray-100 text-black"
			)}
		>
			<Icon className="h-6 w-6" />
		</Link>
	);
};

export default MobileItem;
