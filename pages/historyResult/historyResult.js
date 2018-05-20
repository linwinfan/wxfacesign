var that;
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js')
Page({


    data: {
        unsigns: null,
        signeds: null,
        statusType: ["已签到", "未签到"],
        currentType: 0,
        tabClass: ["red-dot", "red-dot"],
        currentList: null
    },

    statusTap: function (e) {
        var curType = e.currentTarget.dataset.index;
        this.data.currentType = curType
        this.setData({
            currentType: curType
        });
        this.onShow();
    },

    onLoad: function (options) {
        that = this;


    },

    onShow: function () {
        // 获取单列表
        wx.showLoading();
        var that = this;
        if (that.data.currentType == 0) {
            if (that.data.signeds) {
                wx.hideLoading();
                that.setData({
                    currentList: that.data.signeds
                });
            } else {
                var currentUser = Bmob.User.current();

                var Plansign = Bmob.Object.extend("plansign_history");
                var query = new Bmob.Query(Plansign);
                query.equalTo("userId", currentUser.id);

                query.descending('signDate');

                //查询第一条数据
                query.find().then(function (objects) {
                    wx.hideLoading();
                    that.setData({
                        signeds:objects,
                        currentList:objects
                    });
                })
            }

        } else {
            if (that.data.unsigns) {
                wx.hideLoading();
                that.setData({
                    currentList: that.data.unsigns
                });
            } else {
                var currentUser = Bmob.User.current();
                var currentUserBJ = currentUser.attributes.bj;
                var d = new Date();
                var signDate = util.formatDate(d);
                //var signTime = util.formatHourAndMinute(d);
                var Plansign = Bmob.Object.extend("Plansign");
                var query = new Bmob.Query(Plansign);
                query.equalTo("bj", currentUserBJ);
                query.lessThanOrEqualTo("signDate", signDate);
								var signedids=[];
								for (var i = 0; i < that.data.signeds.length; i++) {
									console.log(that.data.signeds[i].get('plansignId'));
									signedids.push(that.data.signeds[i].get('plansignId'));
								}
								query.notContainedIn('objectId',signedids);
                query.descending('signDate');
                query.descending('endtime');
								
                //query.greaterThanOrEqualTo('starttime', signTime);
                //query.lessThanOrEqualTo('endtime', signTime);

                //查询第一条数据
                query.find({
                    success: function (objects) {
                        wx.hideLoading();
												var unsigns = objects;
												that.setData({
														currentList: unsigns,
														unsigns:unsigns
												});
                        
                    },
                    error: function (error) {
                        console.log("查询失败: " + error.code + " " + error.message);
                    }
                });
            }

        }


    },

})
