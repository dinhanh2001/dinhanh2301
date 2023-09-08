import { Instance, SnapshotOut, flow, types } from "mobx-state-tree"
import { apiAuth } from "../services/api/authentication"
import * as LocalStorage from "../utils/storage/index"
import { apiMain } from "../services/api/apiMain"
// import { UserStoreModel } from "./UserStore"

// const user = types.model({
//   user_name: types.maybe(types.string),
//   role: types.maybe(types.string),
//   name: types.maybe(types.string),
//   email: types.maybeNull(types.string),
//   phone: types.maybeNull(types.string)
// })
export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    authPassword: "",
    isLogin: types.maybe(types.boolean),
    // userInfo: types.reference(user),
    name_user: types.maybe(types.string),
    email: types.maybe(types.string),
    timeLimitedAccessToken: types.maybe(types.number),
    timeLimitedRefreshToken: types.maybe(types.number),
    role: types.maybe(types.string),
    idUser: types.maybe(types.string),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationErrors() {
      return {
        authEmail: (function () {
          if (store.authEmail.length === 0) return "can't be blank"
          // if (store.authEmail.length < 6) return "must be at least 6 characters"
          // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
          //   return "must be a valid email address"
          return ""
        })(),
        authPassword: (function () {
          if (store.authPassword.length === 0) return "can't be blank"
          if (store.authPassword.length < 6) return "must be at least 6 characters"
          return ""
        })(),
      }
    },
    setTimeAccessToken(value: number) {
      store.timeLimitedAccessToken = value
    },
    setTimeRefreshToken(value: number) {
      store.timeLimitedRefreshToken = value
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    setAuthPassword(value: string | "") {
      store.authPassword = value.replace(/ /g, "")
    },
    setIsLogin(value: boolean) {
      store.isLogin = value
    },
    setTimeAccessToken(value: number) {
      store.timeLimitedAccessToken = value
    },
    setTimeRefreshToken(value: number) {
      store.timeLimitedRefreshToken = value
    },
    logout: flow(function* () {
      yield LocalStorage.remove("timeAccess")
      yield LocalStorage.remove("timeRefresh")
      yield LocalStorage.remove("AccessToken")
      yield LocalStorage.remove("RefreshToken")
      yield LocalStorage.remove("organizationId")
      store.idUser = ""
      store.authToken = undefined
      store.authPassword = ""
      store.isLogin = false
    }),
    LoginQRApp: flow(function* (username: string, password: string) {
      console.log(username, password)
      const responseLogin = yield apiAuth.LoginApp(username, password)
      if (responseLogin.kind == "ok") {
        const tokenAccess = responseLogin.inforUser["tokens"]["access"]["token"]
        const organizationId = responseLogin["inforUser"]["user"]["org_ids"][0]
        const tokenRefresh = responseLogin.inforUser["tokens"]["refresh"]["token"]
        store.role = responseLogin["inforUser"]["user"]["role"]
        store.idUser = responseLogin["inforUser"]["user"]["id"]
        yield LocalStorage.save("AccessToken", tokenAccess)
        yield LocalStorage.save("RefreshToken", tokenRefresh)
        yield LocalStorage.save("organizationId", organizationId)
        yield LocalStorage.save(
          "timeAccess",
          new Date(responseLogin.inforUser["tokens"]["access"]["expires"]).getTime(),
        )
        yield LocalStorage.save(
          "timeRefresh",
          new Date(responseLogin.inforUser["tokens"]["refresh"]["expires"]).getTime(),
        )
        apiMain.setHeader("Authorization", `Bearer ${tokenAccess}`)
        store.name_user = responseLogin.inforUser["user"]["name"]
        //  store.isLogin = true
        return responseLogin["status"]
      } else {
        return responseLogin["status"]
      }
    }),
    // ReFreshToken: flow(function* () {
    //   const responseReFresh = yield apiAuth.RefreshToken(
    //     store.timeLimitedAccessToken,
    //     store.timeLimitedRefreshToken,
    //   )
    //   let result: boolean
    //   if (responseReFresh.active == true) {
    //     if (typeof responseReFresh.listToken["access"] == "object") {
    //       const tokenAccess = responseReFresh.listToken["access"]["token"]
    //       const tokenRefresh = responseReFresh.listToken["refresh"]["token"]
    //       apiMain.setHeader("Authorization", `Bearer ${tokenAccess}`)
    //       LocalStorage.save("AccessToken", tokenAccess)
    //       LocalStorage.save("RefreshToken", tokenRefresh)
    //       store.timeLimitedAccessToken = new Date(
    //         responseReFresh.listToken["access"]["expires"],
    //       ).getTime()
    //       store.timeLimitedRefreshToken = new Date(
    //         responseReFresh.listToken["refresh"]["expires"],
    //       ).getTime()
    //       result = true
    //     } else {
    //       result = true
    //     }
    //   } else {
    //     result = false
    //     store.isLogin = false
    //   }
    //   return result
    // }),
    testToken: flow(function* () {
      let timeAccess = yield LocalStorage.load("timeAccess")
      let timeRefresh = yield LocalStorage.load("timeRefresh")
      let timeCurent = new Date().getTime()
      let refreshToken = yield LocalStorage.load("AccessToken")
      const response = yield apiAuth.RefreshToken(refreshToken)
      // if(timeCurent> parseInt(access)){
      //   if(timeCurent > parseInt(refresh)){
      //     // logout
      //     yield LocalStorage.remove("AccessToken")
      //     yield LocalStorage.remove("RefreshToken")
      //     store.isLogin = false
      //   }
      //   else {
      //     // refreshtoken
      //   }

      // }
      // else {
      //   console.log("con han")
      // }
    }),
  }))
  .actions((store) => ({
    afterCreate() {
      store.testToken()
    },
  }))
  .preProcessSnapshot((snapshot) => {
    /**
     *  if(timeCurrent > timeAccess){   /// nếu thời gian hiện tại  lớn hơn tgian của access
     *    if(timeCurrent > timeRefresh){ // nếu thời gian hiện tại lớn hơn tgian của refresh ( lỡ may lâu k vào quá hạn của refresh)
     *        logout()
     *  }
     *    else{
     *  goi ham RefreshToken()
     *      }
     *    }
     * else {
     *
     *  con han
     * }
     *
     *
     */
    // remove sensitive data from snapshot to avoid secrets
    // being stored in AsyncStorage in plain text if backing up store
    const { authToken, authPassword, ...rest } = snapshot // eslint-disable-line @typescript-eslint/no-unused-vars

    // see the following for strategies to consider storing secrets on device
    // https://reactnative.dev/docs/security#storing-sensitive-info

    return rest
  })

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file
