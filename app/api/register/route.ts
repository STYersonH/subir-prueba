import bcrypt from "bcrypt"; // para encriptar la contraseña

import prisma from "@/app/libs/prismadb"; // para interactuar con la base de datos
import { NextResponse } from "next/server"; //para manejar las respuestas de la API o solicitud

// funcion POST para registrar un usuario mediante solicitud POST
export async function POST(request: Request) {
	//toma un request de tipo Request
	try {
		// se espera a que se resuelva la promesa de la solicitud POST y se almacena en la constante body
		const body = await request.json();
		// se extrae el correo, nombre y contraseña del cuerpo de la solicitud
		const { email, name, password } = body;

		// si falta alguno de los datos, se devuelve una respuesta de tipo NextResponse
		if (!email || !name || !password) {
			// el estado 400 indica que la solicitud es incorrecta
			return new NextResponse("Missing info", { status: 400 });
		}

		// se proporcionaron todos los datos, se encripta la contraseña
		// hash(password, 12) indica que se encriptara la contraseña 12 veces
		const hashedPassword = await bcrypt.hash(password, 12);

		// se usa la instancia de prisma para crear un usuario en la base de datos
		const user = await prisma.user.create({
			data: {
				email,
				name,
				hashedPassword,
			},
		});

		// devuelve una respuesta de tipo NextResponse con el usuario creado
		return NextResponse.json(user);
		// si ocurre un error, se devuelve una respuesta de tipo NextResponse con el error
	} catch (error: any) {
		console.log(error, "REGISTRATION_ERROR");
		// el estado 500 indica que ocurrio un error interno
		return new NextResponse("Internal error", { status: 500 });
	}
}
