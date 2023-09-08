import {
  Instance,
  SnapshotIn,
  SnapshotOut,
  applySnapshot,
  flow,
  types,
  IStateTreeNode,
} from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { load } from "../utils/storage"
import { apiExplain } from "../services/api/api.explain"

/**
 * Model description here for TypeScript hints.
 */
const memberInfo = types.model().props({
  id: types.maybe(types.string),
  email: types.maybe(types.string),
})
export const ExplainModel = types
  .model("Explain")
  .props({
    reason_name: types.optional(types.string, ""),
    user_id: types.optional(types.string, ""),
    user_name: types.optional(types.string, ""),
    decription: types.optional(types.string, ""),
    id_place: types.optional(types.string, ""),
    place_name: types.optional(types.string, ""),
    members_approval: types.maybe(types.array(memberInfo)),
    date_explain: types.maybe(types.number),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setReasonName: (target: IStateTreeNode, value: string) => {
      console.log(typeof value, value)
      applySnapshot(target, value)
    },
    setUserId: (value: string) => {
      self.user_id = value
    },
    setUserName: (value: string) => {
      self.user_name = value
    },
    setDecription: (value: string) => {
      self.decription = value
    },
    setDateExplain: (value: number) => {
      console.log("func set", value)
      self.date_explain = value
    },
    setIdPlace: (value: string) => {
      self.id_place = value
    },
    setPlaceName: (value: string) => {
      self.place_name = value
    },
    setMemberApproval: (value: any) => {
      self.members_approval = value
    },
  }))
  .actions((self) => ({
    getAllStaff: flow(function* () {
      let access = yield load("AccessToken")
      const org_id = yield load("organizationId")
      const responseLogin = yield apiExplain.GetListStaff(org_id, access)
      return responseLogin["inforUser"]
    }),
    addExplain: flow(function* (
      reason_name: string,
      user_id: string,
      user_name: string,
      id_place: string,
      place_name: string,
      date_explain: number,
      status: string,
      lat: number,
      long: number,
    ) {
      let access = yield load("AccessToken")
      const org_id = yield load("organizationId")
      const responseAddExplain = yield apiExplain.AddToExplainStaff(
        access,
        org_id,
        self.decription,
        reason_name,
        date_explain,
        user_id,
        user_name,
        id_place,
        place_name,
        status,
        lat,
        long,
      )
      return responseAddExplain["active"]
    }),
    getExplains: flow(function* (
      from_date: number,
      to_date: number,
      page: number,
      limit: number,
      user_id?: string,
    ) {
      let access = yield load("AccessToken")
      const org_id = yield load("organizationId")
      const responseGetExplains = yield apiExplain.getExplains(
        access,
        org_id,
        from_date,
        to_date,
        page,
        limit,
        user_id,
      )
      return responseGetExplains["active"] === true ? responseGetExplains["response"] : []
    }),
    getExplainDetail: flow(function* (explain_id: string) {
      let access = yield load("AccessToken")
      const responseGetExplains = yield apiExplain.getExplainDetail(access, explain_id)
      return responseGetExplains["active"] === true ? responseGetExplains["response"] : []
    }),
    upDateExplain: flow(function* (explain_id: string, approval_name) {
      let access = yield load("AccessToken")
      const responseUpdateExplains = yield apiExplain.upDateExplain(
        access,
        explain_id,
        true,
        approval_name,
      )
      return responseUpdateExplains
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Explain extends Instance<typeof ExplainModel> {}
export interface ExplainSnapshotOut extends SnapshotOut<typeof ExplainModel> {}
export interface ExplainSnapshotIn extends SnapshotIn<typeof ExplainModel> {}
export const createExplainDefaultModel = () => types.optional(ExplainModel, {})
