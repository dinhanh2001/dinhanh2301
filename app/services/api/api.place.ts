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
  ListPlaceUser,
  PlacResult,
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
export class Place {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */

  // @demo remove-block-start
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async GetAllPlace(org_id: string, accessToken: string): Promise<ListPlaceUser> {
    const response: ApiResponse<ApiFeedResponse> = await apiMain.get(
      `places?org_id=${org_id}`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    //console.log("response of place at api level: " + JSON.stringify(response["data"]), org_id);

    try {
      if (response.status == 200) return { kind: "ok", result: response["data"]["results"] }
      else return { kind: "bad", result: response.data["results"] }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
  async getAnPlace(placeID: string, accessToken: string): Promise<PlacResult> {
    const response: ApiResponse<ApiFeedResponse> = await apiMain.get(
      `places/${placeID}`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    console.log("get An place", response)

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

  async updatePlace(placeID: string, placeBody: object, accessToken: string): Promise<PlacResult> {
    const response: ApiResponse<ApiFeedResponse> = await apiMain.put(
      `places/${placeID}`,
      placeBody,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    console.log(response.data)

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
}

// Singleton instance of the API for convenience
export const apiPlace = new Place()
