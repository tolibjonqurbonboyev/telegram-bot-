import { config } from "dotenv";
import { cleanEnv, str } from "envalid";
config()

    export const env = cleanEnv(process.env,{
        TOKEN:str()
    })

    export const env1 = cleanEnv(process.env,{
        MY_WEATHER:str()
})