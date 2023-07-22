import { create } from "zustand"; // para gestionar el estado de la lista de usuarios activos

interface ActiveListState {
	members: string[];
	add: (id: string) => void;
	remove: (id: string) => void;
	set: (ids: string[]) => void;
}

// importa la funcion create de zustand para crear un nuevo estado
const useActiveList = create<ActiveListState>((set) => ({
	// set es una funcion que se usa para actualizar el estado
	members: [],
	add: (id) => set((state) => ({ members: [...state.members, id] })),
	remove: (id) =>
		set((state) => ({
			members: state.members.filter((memberId) => memberId !== id),
		})),
	set: (ids) => set({ members: ids }),
}));

export default useActiveList;
