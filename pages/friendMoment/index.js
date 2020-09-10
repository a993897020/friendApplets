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
    pageNum:1,
    pageSize:5,
    totalPage:0,
    /**
     * 点击跳转到发朋友圈
     */
    toLink(){
        wx.navigateTo({
          url: '/pages/friendMomentEdit/index',
        })
    },
    /**
     * 预览图片视频
     * @param {*} e 
     */
    preview(e){
        let {key,i}=e.currentTarget.dataset
        let sources=this.data.blogList[key].fileList.map(p=>({url:p.tempFilePath,type:p.type,poster:p.thumbTempFilePath}))
        wx.previewMedia({
            current: i, 
            sources,
            success:res=>{
                console.log(res)
            }
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
                user._id=res.result._id
                wx.setStorageSync('userInfo', user)
                this.getBlog()
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
   async getBlog(){
        const {pageSize,pageNum}=this
        const params={pageSize,pageNum}
        const uid=wx.getStorageSync('userInfo')._id||''
        wx.showLoading({title:'正在加载...'})
        const {result:{data,totalPage}}=await wx.cloud.callFunction({name:'getBlog',data:{...params}}) 
        const {result:goodList}=await wx.cloud.callFunction({name:'goodBlog',data:{type:'uidGoodList',uid}})
        this.formatData(data,totalPage,goodList)
    },
    /**
     * 操作数据，方便渲染
     * @param {*} data 
     * @param {*} totalPage 
     * @param {*} goodList 
     */
    formatData(data,totalPage,goodList){
        console.log(goodList)
        console.log(data)
        this.totalPage=totalPage
        data.forEach(p=>{
            p.date=timeago(new Date(p.date).getTime(),'Y年M月D日 h:m:s')
            p.isGood=false
            goodList.data.forEach(o=>{
                if(p._id===o.bid){
                    p.isGood=o.isGood
                }
            })
        })
        
        this.setData({
            // blogList:[...this.data.blogList,...data]
            blogList:this.data.blogList.concat(data)
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
    },
    /**
     * 点赞功能
     * @param {*} e 
     */
    async handleGood(e){
        const {isgood,bid}=e.target.dataset
        const {nickName,avatarUrl,_id}=wx.getStorageSync('userInfo')
        const data={
            type:'good',
            nickName,
            avatar:avatarUrl,
            isGood:isgood==='true',
            createAt:new Date(),
            bid,
            uid:_id
        }
       let res= await wx.cloud.callFunction({name:'goodBlog',data})
       console.log(res)
        const blogList=this.data.blogList
        blogList.forEach(p=>{
            if(p._id===bid){
                p.isGood=isgood==='true'
                p.totalGood+=isgood==='true'?1:-1
            }
        })
        this.setData({blogList})
    },
    /**
     * 生命周期函数--监听页面加载
     */
   async onShow() {
        
    },
    onLoad(){
        let {isLogin}=this.data
        let userInfo=wx.getStorageSync('userInfo')||{}
        console.log(userInfo)
        isLogin=JSON.stringify(userInfo)!=='{}'
        this.setData({isLogin})
    },
    // 上拉刷新
    onPullDownRefresh(){
        this.pageNum=1
        this.setData({blogList:[]})
        this.getBlog()
    },
    // 下拉加载
    onReachBottom(){
        console.log(this.totalPage)
        if(this.pageNum===this.totalPage){
            wx.showToast({
                icon:'none',
              title: '数据已经加载完了，亲！',
            })
            return
        }
        this.pageNum++
        this.getBlog()
    }
    

   
})