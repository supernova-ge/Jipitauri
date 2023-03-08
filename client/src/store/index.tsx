import { createStore, action, Action, persist } from "easy-peasy";

interface IUser {
  accessToken?: string | null;
  email?: string | null;
  name?: string | null;
  familyName?: string | null;
  givenName?: string | null;
}

interface StoreModel {
  store: {
    user: IUser | null;
  };
  setUser: Action<StoreModel, IUser>;
}

const Store = createStore<StoreModel>(
  persist({
    store: {
      user: null,
    },
    setUser: action((state, payload) => {
      state.store.user = payload;
    }),
  })
);

export default Store;
