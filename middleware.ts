// se usa para proteger rutas que requieren autenticación, redirige a la página de inicio de sesión si el usuario no está autenticado

import { withAuth } from "next-auth/middleware";

// se establece la ruta de inicio de sesión en '/'
export default withAuth({
	pages: {
		signIn: "/",
	},
});

// se exporta un objeto de configuración que se utiliza para definir las rutas que deben ser protegidas por el middleware
export const config = {
	// matcher para las rutas que comiencen con '/users/' deben ser protegidas
	matcher: ["/users/:path*", "/conversations/:path*"],
};
