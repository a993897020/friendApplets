// pages/cloudSave/index.js
Page({
    data:{
        imgUrl:'',
        videoUrl:''
    },
    /**
     * 上传图片
     */
    uploadImg(){
        let that=this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success (res) {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths[0]
              that.couldUpload(tempFilePaths,`.png`)
            }
          })
    },
    /**
     * 上传到云存储
     * @param {String} url 
     */
    couldUpload(url,type){
        let cloudPath=type.includes('png')||type.includes('mp4')?new Date().getTime()+type:type
        wx.cloud.uploadFile({
            cloudPath,
            filePath:url,
            success:res=>{
                let videoUrl=''
                let imgUrl=''
                type==='.png'?imgUrl=res.fileID:
                    type==='.mp4'?videoUrl=res.fileID:''
                this.setData({imgUrl,videoUrl})
                console.log(res)
            },
            fail:err=>{
                console.log(err)
            }
        })
    },
    /**
     * 上传视频
     */
    uploadVideo(){
        wx.chooseVideo({
            success:res=> {
              console.log(res.tempFilePath)
              this.couldUpload(res.tempFilePath,`.mp4`)
            }
          })
    },
    /**
     * 上传文件
     */
    uploadFile(){
        wx.chooseMessageFile({
          count: 1,
          type:'all',
          success:res=>{
              console.log(res)
              let {path,name}=res.tempFiles[0]
              this.couldUpload(path,name)
          }
        })
    },
    /**
     * 下载并打开文件
     */
    downloadFile(){
        wx.cloud.downloadFile({
            fileID: 'cloud://cloud-d75rf.636c-cloud-d75rf-1300136965/silde.txt',
            success: res => {
                  wx.openDocument({
                    filePath:res.tempFilePath,
                    success:res1=> {
                        console.log(res1)
                      console.log('打开文档成功')
                    }
                  })
            },
            fail: err => {
            }
          })
    }
})