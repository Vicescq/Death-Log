import { create } from "zustand"

type TrueInitLoad = {
    trueInitLoad: boolean
    passInitPhase: () => void
}

export const useTrueInitLoadStore = create<TrueInitLoad>((set) => ({
    trueInitLoad: false,
    passInitPhase: () => {
        set(() => {
            return { trueInitLoad: true }
        })
    }
}))