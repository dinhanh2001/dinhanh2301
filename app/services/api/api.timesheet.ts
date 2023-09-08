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
import type { ApiConfig, ApiFeedResponse, LoginAuthentication, TimeSheetResult } from "./api.types"
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
export class TimeSheet {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */

  // @demo remove-block-start
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async scanQR(placeID: string, accessToken: string): Promise<TimeSheetResult> {
    const response: ApiResponse<ApiFeedResponse> = await apiMain.post(
      `scan-qr`,
      {
        placeId: placeID,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    console.log(response.data)

    try {
      if (response.status == 200) return { kind: "ok", result: response["data"] }
      else return { kind: "bad", result: response.data["results"] }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
  async getAllTimeSheet(accessToken: string, idUser: string, timeStart: number, timeEnd: number) {
    const response: ApiResponse<ApiFeedResponse> = await apiMain.get(
      `timesheet?user=${idUser}&timeStart=${timeStart}&timeEnd=${timeEnd}`,
      null,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
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
  async createTimesheet(dataPost: object, accessToken: string): Promise<TimeSheetResult> {
    const response: ApiResponse<ApiFeedResponse> = await apiMain.post(`timesheet`, dataPost, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    try {
      if (response.status == 200) return { kind: "ok", result: response["data"] }
      else return { kind: "ok", result: response.data }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const apiTimeSheet = new TimeSheet()
