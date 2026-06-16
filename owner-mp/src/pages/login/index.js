/**
 * +----------------------------------------------------------------------
 * | 「e家宜业」
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020-2024 https://www.chowa.cn All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经授权禁止移除「e家宜业」和「卓佤科技」相关版权
 * +----------------------------------------------------------------------
 * | Author: contact@chowa.cn
 * +----------------------------------------------------------------------
 */

import { CwPage } from '../common/page';
import $notify from '../../components/notify/notify';
import utils from '../../utils/index';

CwPage({
    data: {
        loading: false,
        agree: true,
        redirect: null
    },
    onLoad(opts) {
        this.setData({
            redirect: opts.redirect ? decodeURIComponent(opts.redirect) : null
        });
    },
    onShow() {
        if (wx.canIUse('hideHomeButton')) {
            wx.hideHomeButton();
        }
    },
    onAgreeChange(e) {
        if (this.data.loading) {
            return;
        }

        this.setData({
            agree: e.detail
        });
    },
    login() {
        const { agree, loading } = this.data;

        if (loading) {
            return;
        }

        if (!agree) {
            return $notify({
                customNavBar: true,
                type: 'danger',
                message: '请阅读并同意用户协议'
            });
        }

        this.setData({
            loading: true
        });

        // [DEBUG] 跳过微信登录，使用硬编码测试Token
        const DEBUG_TOKEN = 'demo000000000000000000000000001';

        utils.storage.login(DEBUG_TOKEN);

        utils
            .request({
                url: '/user/info',
                method: 'get'
            })
            .then(
                res => {
                    this.setData({
                        loading: false
                    });

                    this.bridge.updateData({
                        userInfo: res.data.userInfo,
                        communityInfo: res.data.communityInfo,
                        globalFetching: false
                    });

                    utils.storage.setUserId(res.data.userInfo.id);

                    if (!res.data.userInfo.intact) {
                        wx.redirectTo({
                            url: '/pages/zone/supplement'
                        });
                    } else if (res.data.communityInfo.list.length === 0) {
                        wx.redirectTo({
                            url: '/pages/community/binding'
                        });
                    } else if (this.data.redirect !== null) {
                        const tbasRoute = ['/pages/home/index', '/pages/service/index', '/pages/zone/index'];

                        if (tbasRoute.includes(this.data.redirect)) {
                            wx.switchTab({
                                url: this.data.redirect
                            });
                        } else {
                            wx.redirectTo({
                                url: this.data.redirect
                            });
                        }
                    } else {
                        wx.switchTab({
                            url: '/pages/home/index'
                        });
                    }
                },
                res => {
                    this.setData({
                        loading: false
                    });
                    return $notify({
                        customNavBar: true,
                        type: 'danger',
                        message: res.message
                    });
                }
            );
    }
});
