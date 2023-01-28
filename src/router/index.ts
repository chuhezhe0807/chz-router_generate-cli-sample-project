import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { studentRouterArr, sysRouterArr, teacherRouterArr } from "./router-list.js";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: { name: "sys-classes" },
        },
        {
            path: "/teacher/teaching",
            name: "teacher-teaching",
            component: () => import("@/views/login/index.vue"),
        },
        {
            path: "/teacher/arrangement",
            name: "teacher-arrangement",
            component: () => import("@/views/login/index.vue"),
        },
        {
            path: "/sys/classes",
            name: "sys-classes",
            component: () => import("@/views/login/index.vue"),
        },
        {
            path: "/sys/organization",
            name: "sys-organization",
            component: () => import("@/views/login/index.vue"),
        },
        {
            path: "/student/def",
            name: "student-def",
            component: () => import("@/views/login/index.vue"),
        },
        // {
        //     path: "/:catchAll(.*)",
        //     // hidden: true,
        //     component: () => import("@/layout/404.vue"),
        // },
        // {
        //     path: "/view1",
        //     name: "view1",
        //     component: () => import("../views/view-1.vue"),
        //     children: [
        //         {
        //             path: "v1children",
        //             name: "v1children",
        //             component: () => import("../views/view-1-children.vue"),
        //         },
        //     ],
        // },
        // {
        //     path: "/view2",
        //     name: "view2",
        //     component: () => import("../views/view-2.vue"),
        // },
    ],
});

function _add(routes: any[]) {
    return new Promise<void>(resolve => {
        let all = [
            ...routes,
            // {
            //     name: "404",
            //     path: "/*",
            //     component: () => import("@/layout/404.vue"),
            // },
        ] as RouteRecordRaw[];
        // 动态添加路由
        all.forEach(item => {
            // router.reloadRouter();
            router.addRoute(item);
        });

        if (!router.hasRoute("404")) {
            router.addRoute({
                path: "/:catchAll(.*)",
                name: "404",
                component: () => import("@/layout/404.vue"),
            });
        }

        // 更新源数据
        router.options.routes = router.options.routes.concat(all);

        // console.log("_add", router.options.routes, all);

        resolve();
    });
}

// 路由拦截
router.beforeEach((to, from, next) => {
    // console.log(to, from);
    const name = to.name as string;
    const path = to.path as string;
    const { params, query, meta } = to;

    let _identity, _platform;
    if (name) {
        _identity = name.split("-")[0];
        _platform = name.split("-")[1];
    } else {
        // 没有name 可能是在刷新页面 重新再添加一次 addRoutes
        _identity = path.split("/")[1];
        _platform = path.split("/")[2];
    }

    if (path == "/") {
        _add(teacherRouterArr);
    }

    if (to.path == from.path) return next();

    // 根据身份信息生成路由
    // console.log("_identity", _identity);
    switch (_identity) {
        case "teacher":
            _add(teacherRouterArr).then(() => {
                // console.log("routes", router.getRoutes());

                // 如果是刷新页面，可能addRoute没有完成，next({...to}) 会一直触发 router 跳转事件，知道添加完成
                if (!name) {
                    next({ ...to });
                } else {
                    next();
                }
                // next({ path: path.replace("/:identity", _identity).replace("/:platform", _platform), query, params: { ...params, identity: _identity } });
            });
            break;
        case "student":
            _add(studentRouterArr).then(() => {
                if (!name) {
                    next({ ...to });
                } else {
                    next();
                }
            });
            break;
        case "sys":
            _add(sysRouterArr).then(() => {
                if (!name) {
                    next({ ...to });
                } else {
                    next();
                }
            });
            break;
        default:
            next({ path, query, params });
            break;
    }
});

declare global {
    interface Window {
        $route: object;
    }
}

window.$route = router;

export default router;
