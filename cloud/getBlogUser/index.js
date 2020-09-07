// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let res=await cloud.database().collection('friendMomentUser').get({
        success:res=>{
            console.log(res)
        },
        fail:err=>{
            console.log(err)
        }
    })
    return {
        result:res,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}