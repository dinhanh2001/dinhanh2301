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
export class Explain {
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
      `users?org_ids=${org_id}&role=leader,admin,manager`,
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
  AddToExplainStaff = async (
    accessToken: string,
    org_id: string,
    decription: string,
    reason_name: string,
    date_explain: number,
    user_id: string,
    user_name: string,
    id_place: string,
    place_name: string,
    status: string,
    lat: number,
    long: number,
  ): Promise<{ active: boolean }> => {
    try {
      const response = await apiMain.post(
        `/explain`,
        {
          org_id,
          decription,
          reason_name,
          date_explain,
          user_id,
          user_name,
          id_place,
          place_name,
          status,
          lat,
          long,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      if (response.status === 201 || response.status === 304) {
        return { active: true }
      } else {
        return { active: false }
      }
    } catch (e) {
      console.log("Error AddToExplainStaff", e)
      return { active: false }
    }
  }

  getExplains = async (
    accessToken: string,
    org_id: string,
    from_date: number,
    to_date: number,
    page: number,
    limit: number,
    user_id?: string,
  ): Promise<{ response: any; active: boolean }> => {
    try {
      const checkId = user_id ? `&user_id=${user_id}` : ""
      const response = await apiMain.get(
        `/explain?org_id=${org_id}&from_date=${from_date}&to_date=${to_date}&page=${page}&limit=${limit}${checkId}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      if (response.status === 200 || response.status === 304) {
        return { response: response.data["results"], active: true }
      } else {
        return { active: false, response: [] }
      }
    } catch (e) {
      console.log("Error AddToExplainStaff", e)
      return { active: false, response: [] }
    }
  }
  getExplainDetail = async (
    accessToken: string,
    explain_id: string,
  ): Promise<{ response: any; active: boolean }> => {
    try {
      const response = await apiMain.get(
        `/explain/${explain_id}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      if (response.status === 200 || response.status === 304) {
        return { response: response.data, active: true }
      } else {
        return { active: false, response: [] }
      }
    } catch (e) {
      console.log("Error AddToExplainStaff", e)
      return { active: false, response: [] }
    }
  }
  upDateExplain = async (
    accessToken: string,
    explain_id: string,
    active: boolean,
    approval_name: string,
  ): Promise<{ response: any; active: boolean }> => {
    try {
      const response = await apiMain.patch(
        `/explain/${explain_id}`,
        { active, approval_name },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      if (response.status === 200 || response.status === 304) {
        return { response: response.data, active: true }
      } else {
        return { active: false, response: [] }
      }
    } catch (e) {
      console.log("Error AddToExplainStaff", e)
      return { active: false, response: [] }
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
export const apiExplain = new Explain()
