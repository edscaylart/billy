import { observable } from "@legendapp/state"

interface IAppState {
  competence: {
    month: number;
    year: number;
  }
}

export const appState$ = observable<IAppState>({
  competence: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  },
})