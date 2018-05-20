var that;
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js')
Page({
    data: {
        loading: true,
        currentUserId: '',
        currentUserXM: '',
        currentUserXH: '',
        imgUrl: '../../images/8-01.png',
        imgTip: '目前没有签到任务',
        plansignId: '',
        showModel: false,
        plansignName: '',
        currentUserBJ: ''
    },
    onShow: function () {
        console.log('onShow ......')
        that = this;
        var user = new Bmob.User(); //开始注册用户

        var newOpenid = wx.getStorageSync('openid')
        if (!newOpenid) {
            wx.login({
                success: function (res) {
                    user.loginWithWeapp(res.code).then(function (user) {
                        var openid = user.get("authData").weapp.openid;
                        console.log(user, 'user', user.id, res);
                        if (user.get("nickName")) {
                            // 第二次访问
                            console.log(user.get("nickName"), 'res.get("nickName")');
                            wx.setStorageSync('openid', openid);
                            if (!user.get("realName") || !user.get("xh") || !user.get(
                                    "bj")) {
                                wx.navigateTo({
                                    url: '../register/register'
                                })
                            } else {
                                that.setData({
                                    currentUserId: user.id,
                                    currentUserXM: user.get('realName'),
                                    currentUserXH: user.get('xh'),
                                    currentUserBJ: user.get('bj'),
                                    showModel: false
                                })
                            }

                        } else {
                            that.setData({
                                showModel: true,
                                loading: false,
                            })


                        }
                    });


                },
                function (err) {
                    console.log(err, 'errr');
                }

            })
        } else {

            getApp().globalData.userInfo = wx.getStorageSync('userInfo')

            //获得是否有签到任务
            var currentUser = Bmob.User.current();
            if (!currentUser.get("realName") || !currentUser.get("xh") || !currentUser.get("bj")) {
                wx.navigateTo({
                    url: '../register/register'
                })
                return
            } else {
                that.setData({
                    currentUserId: currentUser.id,
                    currentUserXM: currentUser.get('realName'),
                    currentUserXH: currentUser.get('xh'),
                    currentUserBJ: currentUser.get('bj'),
                })
            }
            var currentUserBJ = currentUser.attributes.bj;
            var d = new Date();
            var signDate = util.formatDate(d);
            var signTime = util.formatHourAndMinute(d);
            var Plansign = Bmob.Object.extend("Plansign");
            var query = new Bmob.Query(Plansign);
            query.equalTo("bj", currentUserBJ);
            query.equalTo("signDate", signDate);

            query.lessThanOrEqualTo('starttime', signTime);
            query.greaterThanOrEqualTo('endtime', signTime);

            //查询第一条数据
            query.find({
                success: function (objects) {
                    if (objects.length > 0) {
                        for (var i = 0; i < objects.length; i++) {
                            var object = objects[i];

                            console.log(object.id + ' - ' + object.get('signName') + ' - ' +
                                object
                                .get(
                                    'starttime') + ' - ' + object.get('endtime'));
                            if (object.get('starttime') <= signTime && object.get('endtime') >=
                                signTime) {
                                var plansign_history = Bmob.Object.extend("plansign_history");
                                var queryHistory = new Bmob.Query(plansign_history);
                                queryHistory.equalTo("userId", currentUser.id);
                                queryHistory.equalTo("plansignId", object.id);
                                queryHistory.first({
                                    success: function (his) {
                                        if (!his) {
                                            console.log(['您有签到任务', object.get(
                                                'signName')].join(
                                                ':'))
                                            that.setData({
                                                plansignId: object.id,
                                                plansignName: object.get(
                                                    'signName'),
                                                currentUserBJ: object.get(
                                                    'bj'),
                                                imgTip: ['您有签到任务', object.get(
                                                    'signName')].join(
                                                    ':'),
                                                loading: false,
                                            })
                                        } else {
                                            console.log('目前没有签到任务')
                                            that.setData({
                                                plansignId: '',
                                                plansignName: '',
                                                currentUserBJ: '',
                                                imgTip: '目前没有签到任务',
                                                imgUrl: '../../images/8-01.png',
                                                loading: false,
                                            })
                                        }
                                    },
                                    error: function (err) {
                                        console.log("查询失败: " + err.code + " " + err
                                            .message);
                                    }
                                });

                            }
                        }
                    } else {
                        console.log('目前没有签到任务')
                        that.setData({
                            plansignId: '',
                            plansignName: '',
                            currentUserBJ: '',
                            imgTip: '目前没有签到任务',
                            imgUrl: '../../images/8-01.png',
                            loading: false,
                        })
                    }

                },
                error: function (error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                }
            });
        }
    },

    onLoad: function () {
        console.log('onLoad ......')


    },

    //获取用户信息新接口
    agreeGetUser: function (e) {
        //设置用户信息本地存储
        try {
            wx.setStorageSync('userInfo', e.detail.userInfo)
            console.log(e.detail.userInfo)
            var userInfo = e.detail.userInfo;
            var nickName = userInfo.nickName;
            var userPic = userInfo.avatarUrl;
            var openid = wx.getStorageSync('openid');


            var u = Bmob.Object.extend("_User");
            var query = new Bmob.Query(u);
            // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
            query.get(getApp().globalData.userId, {
                success: function (result) {
                    // 自动绑定之前的账号
                    result.set('nickName', nickName);
                    result.set("userPic", userPic);
                    result.set("openid", openid);
                    result.save();

                    if (!result.get("realName") || !result.get("xh") || !result.get("bj")) {
                        wx.navigateTo({
                            url: '../register/register'
                        })
                    }
                }

            });
        } catch (e) {
            console.log(e);
            wx.showToast({
                title: '系统提示:网络错误',
                icon: 'warn',
                duration: 1500,
            })
        }
        let that = this
        that.setData({
            showModel: false
        })
        that.getOP(e.detail.userInfo)
    },
    getOP: function (res) { //提交用户信息 获取用户id
        let that = this
        let userInfo = res
        getApp().globalData.userInfo = userInfo
    },

    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value,
            choseQuestionBank: that.data.array[e.detail.value]
        })
    },

    chose: function () {
        that = this;

        if (wx.createCameraContext()) {
            if (!this.cameraContext) {
                this.cameraContext = wx.createCameraContext('myCamera')
                console.log(this.cameraContext);
            }
        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
            return;
        }
        // 选择图片
        //const ctx = wx.createCameraContext(this)
        console.log('take photo...')
        this.cameraContext.takePhoto({
            quality: 'normal',
            success: (res) => {
                var savedFilePath = res.tempImagePath

                if (savedFilePath != '') {
                    that.setData({
                        imgUrl: savedFilePath,
                        imgTip: '上传验证中'
                    })
                    var xm = that.data.currentUserXM;
                    var xh = that.data.currentUserXH;
                    var cls = that.data.currentUserBJ;

                    util.showBusy('正在上传')

                    // 上传图片
                    const uploadTask = wx.uploadFile({
                        //config.service.uploadUrl
                        //?cls=test&xh=2016000001002&xm=lcg
                        url: 'https://gd.cecgw.cn/testface/clspersonreco',
                        formData: {
                            'xm': xm,
                            'xh': xh,
                            'cls': cls
                        },
                        filePath: that.data.imgUrl,
                        name: 'file',

                        success: function (res1) {
                            console.log(
                                res1);

                            var
                                facerecoresult =
                                JSON.parse(
                                    res1.data
                                );
                            if (
                                facerecoresult
                                .dist &&
                                parseFloat(
                                    facerecoresult
                                    .dist) >=
                                0) {
                                util.showSuccess(
                                    '上传图片至人脸识别服务成功'
                                )
                                console.log(that.data.imgUrl);
                                //保存图片到Bomb
                                var name =
                                    util.formatTime(
                                        new Date()
                                    ) +
                                    ".jpg"; //上传的图片的别名，建议可以用日期命名
                                var file =
                                    new Bmob
                                    .File(
                                        name, [that
                                            .data
                                            .imgUrl
                                        ]

                                    );
                                file.save()
                                    .then(
                                        function (
                                            res2
                                        ) {
                                            var
                                                imgUrl =
                                                res2
                                                .url();
                                            console
                                                .log(
                                                    imgUrl
                                                );
                                            var
                                                History =
                                                Bmob
                                                .Object
                                                .extend(
                                                    "plansign_history"
                                                );
                                            var
                                                History =
                                                new History();
                                            History
                                                .set(
                                                    "userId",
                                                    that.data.currentUserId
                                                );
                                            History
                                                .set(
                                                    "plansignId",
                                                    that
                                                    .data
                                                    .plansignId
                                                )
                                            History
                                                .set(
                                                    "xh",
                                                    xh
                                                );
                                            History
                                                .set(
                                                    "xm",
                                                    xm
                                                );
                                            History
                                                .set(
                                                    'bj',
                                                    that
                                                    .data
                                                    .currentUserBJ
                                                )
                                            History
                                                .set(
                                                    "signName",
                                                    that
                                                    .data
                                                    .plansignName
                                                );
                                            History
                                                .set(
                                                    "dist",
                                                    facerecoresult
                                                    .dist
                                                );
                                            History
                                                .set(
                                                    "imgUrl",
                                                    imgUrl
                                                );

                                            History
                                                .save(
                                                    null, {
                                                        success: function (
                                                            result
                                                        ) {
                                                            console
                                                                .log(
                                                                    result
                                                                )
                                                            that
                                                                .setData({
                                                                    imgUrl: imgUrl,
                                                                    imgTip: '刷脸签到成功',
                                                                    plansignId: ''
                                                                })
                                                        }
                                                    }
                                                );

                                        },
                                        function (
                                            error
                                        ) {
                                            console
                                                .log(
                                                    error
                                                );
                                        })

                            } else {
                                console.log(
                                    res1
                                )
                                util.showSuccess(
                                    '刷脸签到失败，请重试！！！'
                                )
                            }

                        },

                        fail: function (e) {
                            console.log(e);
                            util.showModel(
                                '上传图片失败',
                                e.errMsg
                            )
                        }
                    })
                    uploadTask.onProgressUpdate((res3) => {
                        console.log('上传进度',
                            res3.progress)
                        console.log('已经上传的数据长度',
                            res3.totalBytesSent
                        )
                        console.log(
                            '预期需要上传的数据总长度',
                            res3.totalBytesExpectedToSend
                        )
                    })
                }


               
            },
            fail: function (e) {
                console.log(e)
            }
        })



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


})
