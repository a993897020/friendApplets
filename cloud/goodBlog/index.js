/**
 * 朋友圈点赞
 * 1.需求
 *   用户对该文章进行点赞,只能点赞或者取消点赞
 * 2.设计点赞集合:goodBlog
 *    bid:文章id,
 *    uid:用户id,
 *    isGood:点赞和取消点赞,
 *    createAt:点赞和取消赞时间,
 *    userName:点赞用户名
 *    avatar:点赞用户头像
 * 3.实现流程
 *  -1.云函数拥有三个功能(type)：
 *     -1.查询所有文章的点赞数据(goodList)
 *        -1.在getBlog云函数计算文章的点赞数
 *        -2.前台通过获取用户的点赞的文章,进行标记该用户对文章是否点赞
 *     -2.点赞功能(good)
 *       -1.第一次点赞成功:数据库添加一条该用户点赞的数据
 *       -2.再次点击同个文章点赞,取消点赞:数据库对该条数据进行更新
 *     -3.根据uid获取点赞的文章(getUid)
 */
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
    const {type,...data}=event
    const db=cloud.database().collection('goodBlog')
    if(type==='good'){
        /**
         * 点赞功能
         * 参数:bid,uid,isGood,createAt,userName,avatar
         */
        try{
            let find=await db.where({
                bid:data.bid,
                uid:data.uid
            }).get()
            if(find.data.length===0){
                await db.add({data})
                return {code:1,msg:'ok'}
            }else{
                let {_id}=find.data[0]
                await db.doc(_id).update({data})
                return {code:1,msg:'ok'}
            }
        }catch(err){
            return {code:0,msg:err}
        }
    }else if(type==='goodList'){
        /**
         * 查询所有点赞
         */
        const {data}=await db.get()
            return {code:1,data}
    }else if(type==='uidGoodList'){
        /**
         * 查询用户点赞
         * @param {String} uid
         */
        const res=await db.where({
            uid:data.uid
        }).get()
        console.log(res)
        return {code:1,data:res.data}
    }else{
        return {
            code:0,
            msg:'请输入type'
        }
    }
}