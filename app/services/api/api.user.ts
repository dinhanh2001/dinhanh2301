/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import type {
  ApiConfig,
  ApiFeedResponse,
  LoginAuthentication,
  User,
  RefreshToken, // @demo remove-current-line
  ChangePassword,
} from "./api.types"
import { apiMain } from "./apiMain"
import * as LocalStorage from "../../utils/storage/index"
import { testDateToDate } from "../../utils/common"
/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 20000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class UserApi {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */

  // @demo remove-block-start
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async GetListStaff(org_id: string, accessToken: string): Promise<{}> {
    const response: ApiResponse<ApiFeedResponse> = await apiMain.get(
      `users?org_ids=${org_id}&role=user,leader`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )

    try {
      if (response.status == 200) return { kind: "ok", inforUser: response["data"]["results"] }
      else return { kind: "bad", inforUser: response.data["results"] }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    const response: ApiResponse<ApiFeedResponse> = await apiMain.get(
      `users/current`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    try {
      if (response.status == 200) return { kind: "ok", result: response["data"] }
      else return { kind: "bad", result: response.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  // async changePassword(currentpassword: string,newpassword:string):Promise<ChangePassword> {
  //   try{
  //     const response :ApiResponse<any> = await this.api.apisauce.put(`auth/change-password`,{currentpassword, newpassword})
  //     if(!response.ok){
  //         const problem = getGeneralApiProblem(response)
  //             if(problem) return problem
  //     }
  //     return { kind:"ok",result:response}
  //   }
  //   catch{
  //     return {kind:"bad-data"}
  //   }
  // }
  // @demo remove-block-end
}

// Singleton instance of the API for convenience
export const apiUser = new UserApi()
