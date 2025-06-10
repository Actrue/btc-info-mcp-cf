import { env } from "cloudflare:workers";



export async function getKvMessageByCoinType(coinType:string){
   const key=`加密货币${coinType}- ai信息日报`
   const kvMessage=await env.KV.get(key)
   if(kvMessage){
      return {
        state:true,
        message:"获取日报成功",
        data:kvMessage
      }
   }else{
      return {
        state:false,
        message:"获取日报失败",
        data:null
      }
   }
}