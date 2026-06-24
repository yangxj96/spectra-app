import { defineStore } from "pinia";
import type { UserInfo } from "@/types";

const useAppStore = defineStore("app", {
    state: () => ({
        /** 启动完成标志 */
        ready: false,
        /** 登录 token */
        token: "",
        /** 当前用户信息 */
        userInfo: null as UserInfo | null,
        /** 是否首次启动 */
        isFirstLaunch: true,
        /** uniPush 客户端 ID */
        push_id: ""
    }),

    getters: {
        /** 是否已登录 */
        isLoggedIn: state => !!state.token
    },

    actions: {
        setReady(val: boolean) {
            this.ready = val;
        },
        setToken(token: string) {
            this.token = token;
        },
        setUser(user: UserInfo | null) {
            this.userInfo = user;
        },
        setFirstLaunch(val: boolean) {
            this.isFirstLaunch = val;
        },
        setPushId(id: string) {
            this.push_id = id;
        },
        /** 清除登录状态 */
        clearAuth() {
            this.token = "";
            this.userInfo = null;
            uni.removeStorageSync("token");
            uni.removeStorageSync("refresh_token");
        }
    }
});

export default useAppStore;
