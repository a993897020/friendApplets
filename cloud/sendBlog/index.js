// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env:"cloud-d75rf"
})

// 云函数入口函数
exports.main = async (event, context) => {

    return cloud.database().collection('friendMoment').add({
        data:event,
        success:res=>{
            return {
                message:'添加成功！',
                res
            }
        },
        fail:err=>{
            return {
                message:'添加失败',
                err
            }
        }
    })

    // return event
    // cloud.database().collection('friendMoment').add({})
}