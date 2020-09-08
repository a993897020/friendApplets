// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
/**
 * 分页查询文章
 * @param {*} event:pageSize,pageNum 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const pageSize=event.pageSize>0?event.pageSize:5
    const pageNum=event.pageNum>0?event.pageNum-1:0
    // count()获取该集合的总条数
    const {total}=await cloud.database().collection('friendMoment').count()
    const totalPage=Math.ceil(total/pageSize)
    // skip()获取数据的起始位置
    const {data}=await cloud.database().collection('friendMoment').skip(pageNum*pageSize).limit(pageSize).get({
        success:res=>{
            return res
        },
        fail:err=>{
            return err
        }
    })
    return {
        data,
        pageSize,
        pageNum:pageNum+1,
        totalPage,
        totalCount:total
    }
}