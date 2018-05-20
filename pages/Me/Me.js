var Bmob = require('../../utils/bmob.js');
var app = getApp();
var that;
Page({

  data: {
    userInfo: {},
    isSignAdmin:false
  },

 
  onLoad: function () {
    that = this;
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
		var User = Bmob.Object.extend("_User");
		var queryUser = new Bmob.Query(User);
		queryUser.get(currentUserId, {
			success: function (result) {
				console.log(result);
				that.setData({
					isSignAdmin: result.attributes.isSignAdmin,
					currentUserId: currentUserId,
					userInfo:getApp().globalData.userInfo
				})
			
				
			},
			error: function (object, error) {
				// 查询失败
				console.log(error);
			}
		});
		/*
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      //更新数据
      that.setData({
        userInfo: userInfo,
        
      })
    });*/
  },

  onShow: function () {
  
  },

  testHistory:function(){
    var currentUserId = that.data.currentUserId;
    var User = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(User);
    queryUser.get(currentUserId, {
      success: function (result) {
        var register = result.get("register");
        if (register==false){
          wx.navigateTo({
            url: '../register/register'
          })
        }
        else{
          wx.navigateTo({
            url: '../historyResult/historyResult',
						success: function (res) {
							console.log(res)
						},
						fail: function (res) {
							console.log(res)
						}
          })
        }
      },
      error: function (object, error) {
        // 查询失败
      }
    });
  },

  personalInformation: function () {
    var currentUserId = that.data.currentUserId;
    var User = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(User);
    queryUser.get(currentUserId, {
      success: function (result) {
        var register = result.get("register");
        if (register == false) {
          wx.navigateTo({
            url: '../register/register'
          })
        }
        else {
          wx.navigateTo({
            url: '../personalInformation/personalInformation'
          })
        }
      },
      error: function (object, error) {
        // 查询失败
      }
    });
  },
	
	createSign: function () {
		var currentUserId = that.data.currentUserId;
		var User = Bmob.Object.extend("_User");
		var queryUser = new Bmob.Query(User);
		queryUser.get(currentUserId, {
			success: function (result) {
				var register = result.get("register");
				if (register == false) {
					wx.navigateTo({
						url: '../register/register'
					})
				}
				else {
					wx.navigateTo({
						url: '../signlist/signlist'
					})
				}
			},
			error: function (object, error) {
				// 查询失败
			}
		});
	},

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '刷脸签到',
      path: '/pages/choiceMain/choiceMain',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
	onGotUserInfo: function(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
		that.setData({
			userInfo: e.detail.userInfo,
		})
  },
 
})