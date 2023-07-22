import bcrypt from "bcrypt"; // para encriptar la contraseña
import NextAuth, { AuthOptions } from "next-auth"; //para configurar la autenticación
import CredentialsProvider from "next-auth/providers/credentials"; // para permitir la autenticación con credenciales
import GithubProvider from "next-auth/providers/github"; // para permitir la autenticación con github
import GoogleProvider from "next-auth/providers/google"; // para permitir la autenticación con google
import { PrismaAdapter } from "@next-auth/prisma-adapter"; //conectar la NextAuth a la base de datos con Prisma

import prisma from "@/app/libs/prismadb";

// authOptions contiene la configuración de NextAuth
export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma), // se usara prisma como adaptador de la base de datos
	// se configuran los proveedores de autenticación
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		// autenticacion con correo y contraseña
		CredentialsProvider({
			// toma el nombre de la estrategia de autenticación
			name: "credentials",
			// se configuran las credenciales
			credentials: {
				email: { label: "email", type: "text" },
				password: { label: "password", type: "password" },
			},
			// se configura la función authorize para verificar las credenciales
			async authorize(credentials) {
				// si el correo o la contraseña no se proporcionan, se lanza un error
				if (!credentials?.email || !credentials.password) {
					throw new Error("Invalid Credentials");
				}
				// se busca el usuario en la base de datos con el correo proporcionado
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				// si el usuario no existe (no se encontro en la BD) o no tiene contraseña, se lanza un error
				if (!user || !user?.hashedPassword) {
					throw new Error("Invalid Credentials");
				}

				// si hay usuario, se compara la contraseña proporcionada con la contraseña encriptada del usuario
				const isCorrectPassword = await bcrypt.compare(
					credentials.password,
					user.hashedPassword
				);

				// si la contraseña no es correcta, se lanza un error
				if (!isCorrectPassword) {
					throw new Error("Invalid Credentials");
				}

				return user;
			},
		}),
	],
	// Si la app se ejecuta en modo desarrollo, se activa el modo debug
	debug: process.env.NODE_ENV === "development",

	session: {
		strategy: "jwt", // para gestionar las sesiones usando JSON Web Tokens
	},
	// se establece secret como una clave secreta para firmar y verificar los tokens de sesión
	secret: process.env.NEXTAUTH_SECRET,
};

// se crea el manejador de solicitudes usando la configuración de NextAuth
// pasar el objeto no el tipo
const handler = NextAuth(authOptions);
// se exporta para manejar las solicitudes GET y POST
export { handler as GET, handler as POST };
