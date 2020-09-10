const cloud = require('wx-server-sdk')

cloud.init()

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
    const {data}=await cloud.database().collection('friendMoment').skip(pageNum*pageSize).limit(pageSize).get()
    // 获取每个文章的点赞数
    const goodList=await cloud.database().collection('goodBlog').get()
    data.forEach(o=>{
        o.totalGood=0
        goodList.data.forEach(p=>{
            o.totalGood+=p.bid===o._id&&p.isGood?1:0
        
        })
    })
    
    return {
        data,
        pageSize,
        pageNum:pageNum+1,
        totalPage,
        totalCount:total
    }
}