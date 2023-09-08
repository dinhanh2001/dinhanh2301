import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore" // @demo remove-current-line
import { EpisodeStoreModel } from "./EpisodeStore" // @demo remove-current-line
import { DevisionModel } from "./Devision"
import { TimeSheetModel } from "./TimeSheet"
import { PlaceModel } from "./Place"
import { UserModel } from "./User"
import { ExplainModel } from "./Explain"
/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}), // @demo remove-current-line
  episodeStore: types.optional(EpisodeStoreModel, {}), // @demo remove-current-line
  devisionStore: types.optional(DevisionModel, {}),
  placeStore: types.optional(PlaceModel, {}),
  timesheetStore: types.optional(TimeSheetModel, {}), // @demo remove-current-line
  userStore: types.optional(UserModel, {}),
  explainStore: types.optional(ExplainModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
