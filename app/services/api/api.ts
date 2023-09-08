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
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" // @demo remove-current-line
import type {
  ApiConfig,
  ApiFeedResponse,
  LoginAuthentication, // @demo remove-current-line
} from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode" // @demo remove-current-line
import * as LocalStorage from "../../utils/storage/index"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  getEpisodes() {
    throw new Error("Method not implemented.")
  }
  public apisauce: ApisauceInstance
  config: ApiConfig

  async getAccessToken(): Promise<string> {
    return await LocalStorage.load("AccessToken")
  }
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }
  setup() {
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        Authorization: this.getAccessToken(),
      },
    })
  }
  setAccessToken = (token: string) => {
    if (token) {
      // this.apisauce.setHeader("Authorization", `Bearer ${token}`)
      this.apisauce.setHeader("Authorization", `Bearer ${token}`)
    }
  }

  async testLogin(user_name: string, password: string): Promise<LoginAuthentication> {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(`auth/login`, {
      user_name,
      password,
    })
    console.log(response.status)
    try {
      if (response.status == 200) return { kind: "ok", inforUser: response["data"] }
      else return { kind: "bad", inforUser: response.data["message"] }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad" }
    }
  }
  // @demo remove-block-end
}

// Singleton instance of the API for convenience
export const api = new Api()
