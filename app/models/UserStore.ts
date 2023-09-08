import { flow, Instance, SnapshotIn, SnapshotOut, types, applySnapshot } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import * as storage from "../utils/storage"

/**
 * Model description here for TypeScript hints.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    user_name: types.maybe(types.string),
    role: types.maybe(types.string),
    name: types.maybe(types.string),
    email: types.maybeNull(types.string),
    phone: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setEmail: flow(function* (value: string) {
      self.email = value
    }),
    getCurrentUser: flow(function* getCurrentUser() {
      const tenantId = yield storage.load("tenantId")
      const userApi = new UserApi(self.environment.api)
      const response: GetCurrentUser = yield userApi.getCurrentUser(tenantId)
      if (response["kind"] == "ok" && response["result"]["data"]) {
        const data: object = response["result"]["data"]["result"]
        applySnapshot(self, data)
      } else {
        console.log("Get Current User failed:", response)
        applySnapshot(self, {})
      }
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshotOut extends SnapshotOut<typeof UserStoreModel> {}
export interface UserStoreSnapshotIn extends SnapshotIn<typeof UserStoreModel> {}
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
