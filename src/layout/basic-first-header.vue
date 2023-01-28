<template>
    <el-container class="h-100">
        <el-header class="basic-top-module-header">
            <div class="header-black">Temp-Vue</div>
            <div class="header-right">
                <el-breadcrumb separator-class="el-icon-arrow-right" style="paddingLeft: 20px">
                    <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="`index-${index}`" :to="item" class="breadcrumb-title-item">
                        <span class="breadcrumb">{{ item.title }}</span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <div class="avatar">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            <img :src="logo" alt="logo" style="width: 40px" />
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="logoOut">退出登录</el-dropdown-item>
                                <el-dropdown-item disabled>修改信息</el-dropdown-item>
                                <el-dropdown-item disabled>占位按钮</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
        <el-main class="main-container">
            <div class="router-view">
                <router-view></router-view>
            </div>
        </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router'

import logo from "@/assets/avatar.png"

const $route = useRouter()
let breadcrumb = reactive<Breadcrumb[] | []>([])
// 用户身份
const userIdentity = ref<string>("teacher")

interface Breadcrumb {
    title: string;
    path: string;
    name: string;
    icon?: string;
    requireAuth?: boolean;
}

onMounted(() => {
    const routerNameStr = $route.currentRoute.value.name as string;
    const [identity] = routerNameStr.split("-");
    userIdentity.value = identity;

    let tempArr: any[] = [];
    switch (identity) {
        case 'teacher':
            tempArr = [
                {
                    name: "teacher-teaching-user-teacher-one",
                    path: "/teacher/teaching/user-teacher-one/index",
                    title: "用户端教师一", icon: "iconfont xx-question", requireAuth: true,
                },
                {
                    name: "teacher-arrangement-user-teacher-two",
                    path: "/teacher/arrangement/user-teacher-two/index",
                    title: "用户端教师二", icon: "iconfont xx-question", requireAuth: true,
                },
            ]
            break;
        case 'student':
            tempArr = [
                {
                    name: "student-studying-user-student-one",
                    path: "/student/studying/user-student-one/index",
                    title: "用户端学生一", icon: "iconfont xx-question", requireAuth: true,
                },
                {
                    name: "student-def-user-student-two",
                    path: "/student/def/user-student-two/index",
                    title: "用户端学生二", icon: "iconfont xx-question", requireAuth: true,
                },
            ]
            break;
        case 'sys':
            tempArr = [
                {
                    name: "sys-classes-mgr-organization-one-sub-aside-one",
                    path: "/sys/classes/mgr-organization-one/sub-aside-one/index",
                    title: "管理端组织机构一", icon: "iconfont xx-question", requireAuth: false,
                },
                {
                    name: "sys-organization-mgr-organization-two",
                    path: "/sys/organization/mgr-organization-two/index",
                    title: "管理端组织机构二", icon: "iconfont xx-question", requireAuth: true,
                },
                {
                    name: "sys-def-mgr-organization-three",
                    path: "/sys/def/mgr-organization-three/index",
                    title: "管理端组织机构三", icon: "iconfont xx-question", requireAuth: true,
                }
            ]
            break;
        default:
            break;
    }
    Object.assign(breadcrumb, tempArr)
})


const handleCommand = (command: string) => {
    switch (command) {
        case 'logoOut':
            // console.log('logoOut');
            $route.replace({ path: '/' })
            break;
        default:
            break;
    }
}
</script>

<style lang="scss" scoped>
.basic-top-module-header {
    background-color: #242e4a;
    display: flex;
    align-items: center;
    padding-left: 0;

    .header-black {
        background: #242e4a;
        color: #ffffff;
        padding: 0 25px;
        height: 100%;
        line-height: 60px;
        text-align: center;
        cursor: pointer;
        font-weight: 700;
        flex-shrink: 0;
    }

    .header-right {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .avatar {
            float: right;
            color: #fff;
        }
    }

    .breadcrumb {
        color: #fff;
    }
}

.main-container {
    background: #fff;
    height: 100%;
    overflow: hidden;

    .router-view {
        box-shadow: 0 0 6px 0 #ccc;
        border-radius: 5px;
        background: #fff;
        padding: 10px;
        overflow: hidden;
        height: calc(100% - 15px);
    }
}
</style>