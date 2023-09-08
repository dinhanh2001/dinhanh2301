import { ApisauceInstance, create } from "apisauce";
import Config from "../../config";
import { ApiConfig } from "./api.types";
import { load } from "../../utils/storage";
async function getTokenAccess() {
    let accessToken =  await load("AccessToken")
    return accessToken
}
export const DEFAULT_API_CONFIG: ApiConfig = {
    url: Config.API_URL,
    timeout: 10000,
  }
 
export const apiMain = create({
    baseURL:DEFAULT_API_CONFIG.url,
    timeout: DEFAULT_API_CONFIG.timeout,
    headers: {
      Accept: "application/json"
    }
})
export function setAccessToken (accessToken :string) {
    apiMain.setHeader("Authorization", `Bearer ${accessToken}`)
}
// test Login cach 2
// export class Api {
   
//     apisauce: ApisauceInstance
//     config: ApiConfig
    
 
//     constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
//       this.config = config
//     }
//     setup(){
//       this.apisauce = create({
//         baseURL: this.config.url,
//         timeout: this.config.timeout,
//         headers: {
//           Accept: "application/json"
//         },
//       })
//     }
  

//    setAccessToken  =(token: string) =>  {
//       if (token) {
//         // this.apisauce.setHeader("Authorization", `Bearer ${token}`)
//         this.apisauce.setHeader("Authorization", `Bearer ${token}`)
//       }
//     }
  
    
//     // @demo remove-block-end
//   }
  
//   // Singleton instance of the API for convenience
//   export const api = new Api()
  
