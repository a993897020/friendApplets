// pages/friendMoment/index.js
import {timeago} from '../../utils/util'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        blogList:[],
        isLogin:true
    },
    /**
     * 点击跳转到发朋友圈
     */
    toLink(){
        wx.navigateTo({
          url: '/pages/friendMomentEdit/index',
        })
    },
    /**
     * 点击放大图片
     * @param {*} e 
     */
    preview(e){
        let {key,i}=e.currentTarget.dataset
        let sources=this.data.blogList[key].fileList.map(p=>({url:p.tempFilePath,type:p.type,poster:p.thumbTempFilePath}))
        wx.previewMedia({
            current: i, 
            sources
          })
    },
    /**
     * 登录loading
     */
    loginLoading(){
        wx.showLoading({
          title: '我在登录...',
        })
    },
    /**
     * 登录
     * @param {*} e 
     */
    login(e){
        console.log(e)
        let user=e.detail.userInfo
        let that=this
        let {isLogin}=this.data
        wx.cloud.callFunction({
            name:'login',
            data:{user},
            success:res=>{
                console.log('登录成功',res)
                wx.hideLoading()
                isLogin=true
                that.setData({isLogin})
                wx.setStorageSync('userInfo', user)
            },
            fail:err=>{
                isLogin=false
                console.log('登录失败',err)
                wx.hideLoading()
            },
        })
    },
    /**
     * 获取数据
     */
    getBlog(type){
        type==='refresh'?'':wx.showLoading({title:'正在加载...'})
       wx.cloud.callFunction({
           name:'getBlog',
           success:res=>{
               console.log(res)
                let {result:{data}}=res
                data.forEach(p=>p.date=timeago(new Date(p.date).getTime(),'Y年M月D日 h:m:s'))
                this.setData({
                    blogList:data
                })
                type==='refresh'?'':wx.hideLoading()
                wx.stopPullDownRefresh()
           },
           fail:err=>{
               console.log(err)
           }
       }) 
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
    },
    onLoad(){
        let {isLogin}=this.data
        let userInfo=wx.getStorageSync('userInfo')||{}
        console.log(userInfo)
        isLogin=JSON.stringify(userInfo)!=='{}'
        this.setData({isLogin})
        this.getBlog()
    },
    onPullDownRefresh(){
        this.getBlog('refresh')
    }

   
})