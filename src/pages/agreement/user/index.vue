<template>
    <view class="page">
        <view class="content">
            <view class="title">用户协议</view>
            <view class="update-date">更新日期：2026年1月1日</view>
            <view class="section">
                <text class="section-text">欢迎使用光谱应用（以下简称"本应用"）。</text>
            </view>
            <view class="section">
                <view class="section-title">一、总则</view>
                <text class="section-text">
                    1.1 本协议是您与本应用之间关于使用本应用服务所订立的协议。\n\n
                    1.2 请您在使用本应用服务前仔细阅读本协议。您使用本应用服务即表示您已充分阅读、理解并同意接受本协议的全部内容。\n\n
                    1.3 本应用有权随时修改本协议的任何条款。修改后的协议一经发布即生效，并替代原协议。
                </text>
            </view>
            <view class="section">
                <view class="section-title">二、账号注册与使用</view>
                <text class="section-text">
                    2.1 您在注册账号时应提供真实、准确、完整的个人信息。\n\n
                    2.2 您应妥善保管账号和密码，对以您账号进行的所有活动承担责任。\n\n
                    2.3 未经本应用同意，您不得将账号转让、出借或出售给他人使用。
                </text>
            </view>
            <view class="section">
                <view class="section-title">三、用户行为规范</view>
                <text class="section-text">
                    3.1 您在使用本应用时应遵守中华人民共和国相关法律法规。\n\n
                    3.2 您不得利用本应用从事违法活动，包括但不限于：\n
                    发布、传播违法信息或不良信息；\n
                    侵犯他人知识产权或其他合法权益；\n
                    干扰本应用的正常运营；\n
                    利用本应用进行商业广告宣传。\n\n
                    3.3 如发现用户存在违规行为，本应用有权采取警告、限制功能、暂停或终止服务等措施。
                </text>
            </view>
            <view class="section">
                <view class="section-title">四、服务变更与终止</view>
                <text class="section-text">
                    4.1 本应用有权根据业务发展需要，变更、中断或终止部分或全部服务。\n\n
                    4.2 如用户违反本协议规定，本应用有权终止向该用户提供服务。
                </text>
            </view>
            <view class="section">
                <view class="section-title">五、免责声明</view>
                <text class="section-text">
                    5.1 本应用不对因网络故障、系统维护、第三方原因等导致的暂时无法提供服务承担责任。\n\n
                    5.2 本应用不对用户因使用本服务而产生的任何间接损失承担责任。
                </text>
            </view>
            <view class="section">
                <view class="section-title">六、其他</view>
                <text class="section-text">
                    6.1 本协议的解释、效力及争议解决，适用中华人民共和国法律。\n\n
                    6.2 如本协议的任何条款被认定为无效，不影响其他条款的效力。
                </text>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #fff;
}

.content {
    padding: 40rpx 36rpx 60rpx;
}

.title {
    font-size: 40rpx;
    font-weight: 700;
    color: #1a1a2e;
    text-align: center;
    margin-bottom: 16rpx;
}

.update-date {
    font-size: 24rpx;
    color: #999;
    text-align: center;
    margin-bottom: 40rpx;
}

.section {
    margin-bottom: 32rpx;
}

.section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
}

.section-text {
    font-size: 28rpx;
    color: #555;
    line-height: 1.8;
    white-space: pre-line;
}
</style>
