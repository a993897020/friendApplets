


Page({
    /**
     * 页面的初始数据
     */
    data: {
            content:'',
            fileList:[]
    },
    
    /**
     * 获取input value
     * @param {*} e 
     */
    handleInput(e){
        let content=e.detail.value
        this.setData({
            content
        })
    },
    /**
     * 图片上传和视频上传
     */
    uploadFile(){
        // wx.chooseImage({
        //     count: 9,
        //     sizeType: ['original', 'compressed'],
        //     sourceType: ['album', 'camera'],
        //     success :res=> {
        //       // tempFilePath可以作为img标签的src属性显示图片
        //       console.log(res)
        //       const tempFilePaths = res.tempFilePaths
        //       this.setData({
        //           imgList:this.data.imgList.concat(tempFilePaths)
        //       })
        //     }
        //   })
        wx.chooseMedia({
            count: 9,
            mediaType: ['image','video'],
            sourceType: ['album', 'camera'],
            maxDuration: 30,
            camera: 'back',
            success:res=> {
                console.log(res)
                    let list=res.tempFiles
                    list.forEach(p=>{p.type=res.type})
                    this.setData({
                    fileList:this.data.fileList.concat(list)
                     })
                }
          })
    },
    /**
     * 文件删除
     */
    fileDel(e){
        let {index}=e.currentTarget.dataset
        let {fileList}=this.data
        fileList.splice(index,1)
        this.setData({fileList})
    },
    /**
     * 文章发布
     */
    sendBlog(){
        let that=this
        let {fileList,content}=this.data
        let files=[]
        if(!content.trim()){
            console.log(!content.trim())
            wx.showToast({
              title: '内容不可为空',
              icon:'none',
              mask:true
            })
            return
        }
        wx.showLoading({
            title: '正在发布...',
          })
        if(fileList.length>0){
            fileList.forEach((p,i)=>{
                let type=p.type==='image'?'.jpg':'.mp4'
                wx.cloud.uploadFile({
                   cloudPath:new Date().getTime()+type,
                   filePath:p.tempFilePath,
                   success:res=>{
                    p.tempFilePath=res.fileID
                        files.push({...p})
                        if(fileList.length===files.length){
                           that.addBlog(files,content)
                        }
                   },
                   fail:err=>{
                       console.log(err)
                   }
               })
               
           })
        }else{
            that.addBlog(files,content)
        }
       
    },
    /**
     * 把数据添加到数据库
     * @param {*} imgList 
     * @param {*} content 
     */
    addBlog(fileList,content){
        let that=this
        let userInfo=wx.getStorageSync('userInfo')
        let data={
            nickName:userInfo.nickName,
            avatar:userInfo.avatarUrl,
            content,
            fileList,
            date:new Date()
        }
         wx.cloud.callFunction({
            name:'sendBlog',
            data,
            success:res=>{
                wx.hideLoading()
                wx.showToast({
                  title: '发布成功！',
                })
                that.setData({
                    content:'',
                    fileList:[]
                })
                console.log('发布成功',res)
                setTimeout(()=>{
                    wx.navigateBack({
                        delta: 1,
                      })
                },1000)
            },
            fail:err=>{
                console.log(err)
            }
        })
    }
})