const DB=wx.cloud.database().collection('list')
let name=""
let age=""
let id=""
Page({
  // 获取添加数据name
  getName(e){
    name=e.detail.value
  },
  // 获取添加数据age
  getAge(e){
    age=e.detail.value
  },
  // 获取id
  getId(e){
    id=e.detail.value
  },
  // 添加数据
  handleAdd(){
    DB.add({
      data:{
        name,
        age
      },
      success:res=>{
        console.log(res)
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  // 查询数据
  handleGet(){
    DB.get({
      success:res=>{
        console.log(res)
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  // 更新数据 
  handleSet(){
    DB.doc(id).update({
      data:{
        name,age
      },
      success:res=>{
        console.log(res)
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  // 删除数据
  handleDelete(){
    DB.doc(id).remove({
      success:res=>{
        console.log(res)
      },
      fail:err=>{
        console.log(err)
      }
    })
  }
})
