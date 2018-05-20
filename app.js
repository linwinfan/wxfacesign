var Bmob = require('utils/bmob.js');
Bmob.initialize("72cef7c17112b0d0cbf6455fc6fc198b", "a78190151881c296217d8dab4ef68a8f");

App({
    onLaunch: function () {
				var that = this
        var user = new Bmob.User(); //开始注册用户

        var newOpenid = wx.getStorageSync('openid')
        if (!newOpenid) {
            wx.login({
                success: function (res) {
                    user.loginWithWeapp(res.code).then(function (user) {
                        var openid = user.get("authData").weapp.openid;
                        console.log(user, 'user', user.id, res);
												that.globalData.userId=user.id
												wx.setStorageSync('openid', openid);
                        

                    }, function (err) {
                        console.log(err, 'errr');
                    });

                }
            });
        }
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function () {

                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    globalData: {
        userInfo: null,
        userId: '',
		userXM:'',
		userXH:'',
		userBJ:''，
		plansignId:''

    }
})
