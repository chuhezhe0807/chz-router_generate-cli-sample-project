<template>
    <el-container style="height: 100%; width: 100%;">
        <el-aside width="280px" class="second-module-aside" style="height: 100%">
            <ul class="second-nav-ui">
                <li @click="_onSecondNavItemCick(item)" v-for="(item) in secondLevelList" class="second-nav-li" :class="{ 'currentNavItem': selected.name == item.name, }" :key="item.name + 'secondLevel'">{{ item.title }}</li>
            </ul>
        </el-aside>
        <el-main class="second-module-main" style="height: 100%; width: 100%;">
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'

const $route = useRouter()
// 用户身份
const userIdentity = ref<string>("teacher")

const secondLevelList = reactive<Breadcrumb[] | []>([])
const selected = reactive<Breadcrumb>({
    title: '',
    path: '',
    name: '',
    icon: '',
    requireAuth: true,
})

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
            break;
        case 'student':

            break;
        case 'sys':
            tempArr = [
                {
                    name: "sys-classes-mgr-organization-one-sub-aside-one",
                    path: "/sys/classes/mgr-organization-one/sub-aside-one/index",
                    title: "侧边栏一", icon: "iconfont xx-question", requireAuth: true,
                },
                {
                    name: "sys-classes-mgr-organization-one-sub-aside-two",
                    path: "/sys/classes/mgr-organization-one/sub-aside-two/index",
                    title: "侧边栏二", icon: "iconfont xx-question", requireAuth: true,
                },
                {
                    name: "sys-classes-mgr-organization-one-sub-aside-three",
                    path: "/sys/classes/mgr-organization-one/sub-aside-three/index",
                    title: "侧边栏三", icon: "iconfont xx-question", requireAuth: true,
                },
                {
                    name: "sys-classes-mgr-organization-one-sub-aside-four",
                    path: "/sys/classes/mgr-organization-one/sub-aside-four/index",
                    title: "侧边栏四", icon: "iconfont xx-question", requireAuth: true,
                },
            ]
            break;
        default:
            break;
    }
    Object.assign(secondLevelList, tempArr)
})


const _onSecondNavItemCick = (item: Breadcrumb) => {
    // console.log(item.name);
    $route.push({ name: item.name })
}
</script>

<style lang="scss" scoped>
.second-module-aside {
    background-color: #ecf5ff;
    width: 200px;
    // border-radius: 5px;
    box-shadow: 0 0 6px 0 #ccc;
    margin-right: 10px;
    flex-shrink: 0;

    .second-nav-ui {
        padding-left: 0px;

        .second-nav-li {
            display: block;
            height: 40px;
            line-height: 40px;
            padding-left: 30px;
            cursor: pointer;

            &:hover {
                background-color: #fff;
            }
        }
    }

    .currentNavItem {
        background-color: #e6edf0;
        border-right: 2px solid #73c0de;
    }
}

.second-module-main {
    background-color: #fff;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    box-shadow: 0 0 6px 0 #ccc;
    margin-left: 10px;
}
</style>