"use client"; // renderizar solo en el lado del cliente -> NEXT 13

import axios from "axios";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/input";
import { useCallback, useEffect, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import AuthSocialButton from "./AuthSocialButton";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Limitar los valores a elegir
type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
	const session = useSession();
	const router = useRouter();
	// Solo se tendra 2 valores posibles para variant
	const [variant, setVariant] = useState<Variant>("LOGIN");
	const [isLoading, setIsLoading] = useState(false);

	// verificar si el usuario esta autenticado, para redirigirlo
	useEffect(() => {
		if (session?.status === "authenticated") {
			//console.log("Authenticated");
			router.push("/conversations");
		}
	}, [session?.status, router]);

	// memoiza la funcion toggleVariant para que no se vuelva a crear
	// solo se crea una vez y se reutiliza en cada render
	const toggleVariant = useCallback(() => {
		if (variant === "LOGIN") {
			setVariant("REGISTER");
		} else {
			setVariant("LOGIN");
		}
	}, [variant]); //[variant] indica que solo se creara la funcion cuando variant cambie

	// se devuelve un objeto que se desestructura
	const {
		register, // se usa para registrar los inputs del formulario
		handleSubmit, // se usa para manejar el submit del formulario
		formState: { errors }, // se usa para manejar los errores del formulario
	} = useForm<FieldValues>({
		//useForm para manejar el estado y validacion del formulario
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	// se usa para manejar el submit del formulario
	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		// Si se esta enviando significa que debemos habilitar el loading
		setIsLoading(true);
		if (variant === "REGISTER") {
			// api/register ya que en la carpeta app/api/register esta el archivo de registro
			axios
				.post("/api/register", data) // envia una peticion post a la api
				.then(() => signIn("credentials", { ...data, redirect: false })) // si la solicitud se completa, inicia sesion
				.catch(() => toast.error("Something went wrong!")) // si la solicitud falla, muestra un errork usando toast
				.finally(() => setIsLoading(false)); // si la solicitud se completa, deshabilita el loading
		}
		if (variant === "LOGIN") {
			signIn("credentials", {
				...data,
				redirect: false,
			})
				.then((callback) => {
					if (callback?.error) {
						toast.error("Invalid credentials");
					}

					if (callback?.ok && !callback?.error) {
						toast.success("Welcome back!");
						router.push("/conversations");
					}
				})
				.finally(() => setIsLoading(false));
		}
	};

	const socialAction = (action: string) => {
		setIsLoading(true);

		// NextAuth social Signin
		signIn(action, { redirect: false })
			.then((callback) => {
				if (callback?.error) {
					toast.error("Invalid credentials!");
				}
				if (callback?.ok && !callback?.error) {
					toast.success("Welcome back!");
				}
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
			<div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
				<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
					{variant === "REGISTER" && (
						<Input
							id="name"
							label="Name"
							register={register}
							errors={errors}
							disabled={isLoading} // se deshabilita el input cuando se esta enviando
						/>
					)}
					<Input
						id="email"
						label="Email adress"
						type="email"
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
					<Input
						id="password"
						label="Password"
						type="password"
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
					<div>
						{/* Como el boton esta dentro del form, no necesitamos un onClick, se enviara por defecto */}
						<Button disabled={isLoading} fullWidth type="submit">
							{variant === "LOGIN" ? "Sign in" : "Register"}
						</Button>
					</div>
				</form>

				<div className="mt-6">
					<div className="relative">
						{/* haciendo el efecto de ----------- texto ----------- */}
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-2 text-gray-500">
								Or continue with
							</span>
						</div>
					</div>

					{/* Registro con github y google */}
					<div className="mt-6 flex gap-2">
						<AuthSocialButton
							icon={BsGithub}
							onClick={() => socialAction("github")}
						/>
						<AuthSocialButton
							icon={BsGoogle}
							onClick={() => socialAction("google")}
						/>
					</div>
				</div>

				<div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
					<div>
						{variant === "LOGIN"
							? "New to Messenger?"
							: "Already have an account?"}
					</div>
					<div onClick={toggleVariant} className="underline cursor-pointer">
						{variant === "LOGIN" ? "Create an account" : "Login"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
