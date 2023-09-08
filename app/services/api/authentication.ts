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
export class Auth {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  setAccessToken = (token: string) => {
    if (token) {
      // this.apisauce.setHeader("Authorization", `Bearer ${token}`)
      this.apisauce.setHeader("Authorization", `Bearer ${token}`)
    }
  }
  // @demo remove-block-start
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async LoginApp(username: string, password: string): Promise<LoginAuthentication> {
    const response: ApiResponse<ApiFeedResponse> = await apiMain.post(`auth/login`, {
      username,
      password,
    })
    console.log(response.status)
    try {
      if (response.status == 200) return { kind: "ok", inforUser: response["data"], status: 200 }
      else if (response.status == 400 || response.status == 401)
        return { kind: "bad", inforUser: {}, status: 400 }
      else if (response.status >= 500 || response.status == null)
        return { kind: "bad", inforUser: {}, status: 500 }
    } catch (e) {
      if (__DEV__) {
        // console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad", status: 500, inforUser: {} }
    }
  }
  async RefreshToken(refreshToken: string): Promise<RefreshToken> {
    try {
      const response: ApiResponse<ApiFeedResponse> = await apiMain.post(`auth/refresh-tokens`, {
        refreshToken,
      })
      // apiMain.setHeader("Authorization", response.data["access"]["token"])
      // LocalStorage.save("RefreshToken", response.data["refresh"]["token"])
      return { active: true, listToken: response.data }
    } catch (e) {
      return { active: false, listToken: {} }
    }
  }
}

// Singleton instance of the API for convenience
export const apiAuth = new Auth()
