// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env:"cloud-d75rf"
})

// 云函数入口函数
exports.main = async (event, context) => {
    const data=event
    try{
    await cloud.database().collection('friendMoment').add({data})
    return {code:1,msg:'ok'}
    }catch(err){
        return {code:0,msg:err}
    }
}