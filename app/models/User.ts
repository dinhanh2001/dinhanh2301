import { Instance, SnapshotIn, SnapshotOut, types, flow } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { apiUser } from "../services/api/api.user"
import { load } from "../utils/storage"
/**
 * Model description here for TypeScript hints.
 */
const userInfo = types.model().props({
  id: types.maybe(types.string),
  name: types.maybe(types.string),
  username: types.maybe(types.string),
  phone: types.maybe(types.string),
  email: types.maybe(types.string),
  gender: types.maybe(types.string),
  org_ids: types.maybe(types.array(types.string)),

  role: types.maybe(types.string),
})

export const UserModel = types
  .model("User")
  .props({
    user: types.optional(types.frozen(userInfo), {}),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    getUserByOrg: flow(function* () {
      let access = yield load("AccessToken")
      const org_id = yield load("organizationId")
      let getUser = yield apiUser.GetListStaff(org_id, access)
      if (getUser.kind == "ok") {
        return getUser["inforUser"]
      } else {
        return []
      }
    }),
    getCurrentUser: flow(function* () {
      let access = yield load("AccessToken")
      const user = yield apiUser.getCurrentUser(access)
      // console.log("user model: ", user)

      if (user.kind == "ok") {
        self.user = user.result
        return user["result"]
      } else {
        return {}
      }
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
