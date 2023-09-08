import { Instance, SnapshotIn, SnapshotOut, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { apiExplain } from "../services/api/api.explain"
import { load } from "../utils/storage"
/**
 * Model description here for TypeScript hints.
 */
const memberInfo = types.model().props({
  id: types.maybe(types.string),
  email: types.maybe(types.string),
})
export const DevisionModel = types
  .model("Devision")
  .props({
    listStaff: types.maybe(types.array(memberInfo)),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    getAllStaff: flow(function* () {
      let access = yield load("AccessToken")
      const org_id = yield load("organizationId")
      const responseUser = yield apiExplain.GetListStaff(org_id, access)
      console.log(responseUser["inforUser"])
      return responseUser["inforUser"]
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Devision extends Instance<typeof DevisionModel> {}
export interface DevisionSnapshotOut extends SnapshotOut<typeof DevisionModel> {}
export interface DevisionSnapshotIn extends SnapshotIn<typeof DevisionModel> {}
export const createDevisionDefaultModel = () => types.optional(DevisionModel, {})
