// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    let {user}=event
    let {OPENID,APPID,UNIOID}=cloud.getWXContext()
    user.important={openId:OPENID,appId:APPID,unioId:UNIOID}
    
   let {result:{result}}= await cloud.callFunction({
        name:'getBlogUser',
        success:res=>{
            console.log(res)
        },
        fail:err=>{
            console.log(err)
        }
    })
    let index=result.data.findIndex(p=>p.important.openId===OPENID)
    // 避免重复添加数据库
    if(index===-1){
        let data=await cloud.database().collection('friendMomentUser').add({
            data:user,
            success:res=>{
                return res
            },
            fail:err=>{
                return err
            } 
         })
         return {code:200,data,message:'登录成功'}
    }else{
         return {code:200,_id:result.data[index]._id,message:'登录成功'}
    }
       
}