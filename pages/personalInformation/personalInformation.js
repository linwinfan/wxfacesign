var Bmob = require('../../utils/bmob.js');
var app = getApp();
var that;
Page({

  data: {
    userInfo: {},
    currentUserId: null,
    realName:'',
    xh:'',
    xuexiao:'',
    xueyuan:'',
		bj:'',
    telephone:''
  },


  onLoad: function () {
    that = this;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      //更新数据
      that.setData({
        userInfo: userInfo,
        currentUserId: currentUserId
      })
    })

    var User = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(User);
    queryUser.get(currentUserId, {
      success: function (result) {
        that.setData({
          xh: result.attributes.xh,
          telephone: result.attributes.telephone,
          realName: result.attributes.realName,
          xuexiao:result.attributes.xuexiao,
					xueyuan:result.attributes.xueyuan,
					bj:result.attributes.bj
        })
       
        
      },
      error: function (object, error) {
        // 查询失败
      }
    });
  },
  
  onShow: function () {
  
  },


})