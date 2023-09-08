import { Instance, SnapshotIn, SnapshotOut, flow, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { apiPlace } from "../services/api/api.place"
import * as LocalStorage from "../utils/storage/index"
import { load } from "../utils/storage"
/**
 * Model description here for TypeScript hints.
 */
const placeInfo = types.model().props({
  id: types.maybe(types.string),
  address: types.maybe(types.string),
  ip_address: types.maybe(types.string),
  lat: types.maybe(types.number),
  long: types.maybe(types.number),
  mac: types.maybe(types.boolean),
  wifi: types.maybe(types.boolean),
  wifi_name: types.maybe(types.string),
  date: types.maybe(types.string),
  mac_address: types.maybe(types.string),
  minimumTime: types.maybe(types.number),
  name: types.maybe(types.string),
  org_id: types.maybe(types.string),
  r: types.maybe(types.number),
  status: types.maybe(types.string),
  time_start: types.maybe(types.number),
  time_end: types.maybe(types.number),
})
export const PlaceModel = types
  .model("Place")
  .props({
    place: types.optional(types.frozen(placeInfo), {}),
    getAllPlaceStt: types.maybe(types.string),
    getAnPlaceStt: types.maybe(types.string),
    updatePlaceStt: types.maybe(types.string),
    listPlaces: types.maybe(types.array(placeInfo)),
    numberPlace: types.optional(types.number, 0),
    countChecked: types.optional(types.number, 0),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    getAllPlace: flow(function* () {
      let access = yield load("AccessToken")
      const org_id = yield LocalStorage.load("organizationId")
      const responsePlace = yield apiPlace.GetAllPlace(org_id, access)
      const result = responsePlace["result"]
      let cout = 0
      if (result != null) {
        result.forEach((el) => {
          if (el["status"] == "in") {
            cout++
          }
        })
        self.countChecked = cout
        self.numberPlace = result.length
        self.listPlaces = result
      } else {
      }
    }),
    /**
     * @param {placeID: String} snapshot
     * @method put
     */
    getAnPlace: flow(function* (placeID) {
      let access = yield load("AccessToken")
      const place = yield apiPlace.getAnPlace(placeID, access)
      const placeTemp = place["result"]
      self.place = placeTemp
      self.getAnPlaceStt = place.kind
      console.log("get Anplace", { placeTemp })
      return place
    }),

    /**
     * @param {placeID: String} snapshot
     * @method put
     */
    updatePlace: flow(function* (placeID, placeBody) {
      let access = yield load("AccessToken")
      const place = yield apiPlace.updatePlace(placeID, placeBody, access)
      const placeTemp = place["result"]
      self.place = placeTemp
      self.updatePlaceStt = place.kind
      console.log({ placeTemp })
      return place
    }),
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Place extends Instance<typeof PlaceModel> {}
export interface PlaceSnapshotOut extends SnapshotOut<typeof PlaceModel> {}
export interface PlaceSnapshotIn extends SnapshotIn<typeof PlaceModel> {}
export const createPlaceDefaultModel = () => types.optional(PlaceModel, {})
