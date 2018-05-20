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


    },

    onShow: function () {
        // 获取单列表
        wx.showLoading();
        var that = this;

        var currentUser = Bmob.User.current();
        var currentUserBJ = currentUser.attributes.bj;
        var d = new Date();
        //var signDate = util.formatDate(d);
        //var signTime = util.formatHourAndMinute(d);
        var Plansign = Bmob.Object.extend("Plansign");
        var query = new Bmob.Query(Plansign);
        query.equalTo("bj", currentUserBJ);
        //query.lessThanOrEqualTo("signDate", signDate);

        query.descending('signDate');
        query.descending('endtime');

        //query.greaterThanOrEqualTo('starttime', signTime);
        //query.lessThanOrEqualTo('endtime', signTime);
        query.limit(50);
        //查询第一条数据
        query.find({
            success: function (objects) {
                wx.hideLoading();
                that.setData({
                    currentList: objects,
                });

            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        });


    },
	
    delPlansign: function (e) {
        console.log(e.currentTarget.dataset.id);
        that=this;
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    var Plansign = Bmob.Object.extend("Plansign");
                    var query = new Bmob.Query(Plansign);
                    query.get(e.currentTarget.dataset.id, {
                        success: function (object) {
                            // The object was retrieved successfully.
                            object.destroy({
                                success: function (deleteObject) {
                                    console.log('删除成功');
									                  that.onShow();
                                },
                                error: function (object, error) {
                                    console.log('删除失败');
									wx.showToast('删除失败')
                                }
                            });
                        },
                        error: function (object, error) {
                            console.log("query object fail");
                        }
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
	
	createSign: function () {
		wx.navigateTo({
			url: '../createSign/createSign'
		})
	},
	

})
