var that;
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js')
Page({
    data: {
        loading: true,
    },
    onShow: function () {
        console.log('onShow ......')
				that = this
				that.setData({loading: false})
    },

    onLoad: function () {
        console.log('onLoad ......')


    },

    chose: function () {
        that = this;

        if (wx.createCameraContext()) {
            if (!this.cameraContext) {
                this.cameraContext = wx.createCameraContext('myCamera')
                //console.log(this.cameraContext);
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
                    wx.showLoading();
										
                    var xm = getApp().globalData.serXM;
                    var xh = getApp().globalData.userXH;
                    var cls = getApp().globalData.userBJ;
										//var userId = getApp().globalData.userId;
                    

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
                        filePath: savedFilePath,
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
                                console.log(savedFilePath);
                                //保存图片到Bomb
                                var name =
                                    util.formatTime(
                                        new Date()
                                    ) +
                                    ".jpg"; //上传的图片的别名，建议可以用日期命名
                                var file =
                                    new Bmob
                                    .File(
                                        name, [savedFilePath]

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
                                                    getApp().globalData.userId
                                                );
                                            History
                                                .set(
                                                    "plansignId",
                                                    getApp().globalData.plansignId
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
                                                    bj
                                                )
                                            History
                                                .set(
                                                    "signName",
                                                    getApp().globalData.plansignName
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
