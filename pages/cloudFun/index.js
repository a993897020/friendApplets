// pages/cloudFun/index.js
Page({

    cloudSum(){
        wx.cloud.callFunction({
            name:"add",
            data:{a:1,b:2},
            success:res=>{
                console.log(res)
            },
            fail:err=>{
                console.log(err)
            }
        })
    },
    getOpenId(){
        wx.cloud.callFunction({
            name:'getOpenid',
            success:res=>{
                console.log(res)
            },
            fail:err=>{
                console.log(err)
            }
        })
    },
    /**
     * 客户端获取数据库数据受权限控制
     * 最多可以获取20条数据
     * 等等
     */
    getDatabase(){
        wx.cloud.database().collection('list').get({
            success:res=>{
                console.log(res)
            },
            fail:err=>{
                console.log(err)
            }
        })
    },
    getCloudData(){
        wx.cloud.callFunction({
            name:'getDatabase',
            success:res=>{
                console.log(res)
            },
            fail:err=>{
                console.log(err)
            }
        })
    }

})