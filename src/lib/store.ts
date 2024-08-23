import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

/** ----------------------------------------------------------------------------------------------
 *  useUserStore
 * ----------------------------------------------------------------------------------------------- */

type UserState = {
  username: string | null
  token: string | null
  rehydrated: boolean
  loading: boolean
}

type UserActions = {
  addUser: (username: string, token: string) => void
  setUser: (partialState: Partial<UserState>) => void
}

type UserStore = UserState & UserActions

export const useUserStore = create<UserStore>()(
  persist<UserStore>(
    (set) => ({
      username: null,
      token: null,
      rehydrated: false,
      loading: false,
      addUser: (username, token) =>
        set({
          username,
          token,
        }),
      setUser: (partialState) => set(partialState),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            state.setUser({ rehydrated: true })
          }
        }
      },
    }
  )
)

/** ----------------------------------------------------------------------------------------------
 *  useSidebarStore
 * ----------------------------------------------------------------------------------------------- */

interface SidebarStore {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggle: () => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
