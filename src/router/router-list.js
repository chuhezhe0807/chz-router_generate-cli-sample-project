export const sysRouterArr = [
    {
        name: 'sys-organization-mgr-organization-two',
        path: '/sys/organization/mgr-organization-two/index',
        meta: { title: '管理端组织机构二', icon: 'iconfont xx-question', requireAuth: true },
        component: () => import('@/views/mgr-organization-two/index.vue'),
        children: [
            {
                name: 'mgr-organization-two-father',
                path: '/sys/organization/mgr/organization/two/father',
                component: () => import('@/layout/basic-empty-route.vue'),
                children: [
                    {
                        name: 'sys-organization-mgr-organization-two-mgr-two-children',
                        path: '/sys/organization/mgr-organization-two/mgr-two-children/index',
                        meta: { title: '管理端组织机构二-子路由', icon: 'iconfont xx-question', requireAuth: true },
                        component: () => import('@/views/mgr-organization-two/mgr-two-children/index.vue'),
                    },
                ]
            },
        ]
    },
    {
        name: 'home-component',
        path: '/sys/component/home/component',
        component: () => import('@/layout/basic-first-header.vue'),
        children: [
            {
                name: 'sys-classes-mgr-organization-one',
                path: '/sys/classes/mgr-organization-one/index',
                meta: { title: '管理端组织机构一', icon: 'iconfont xx-question', requireAuth: false },
                component: () => import('@/views/mgr-organization-one/index.vue'),
                children: [
                    {
                        name: 'sys-classes-mgr-organization-one-sub-aside-two',
                        path: '/sys/classes/mgr-organization-one/sub-aside-two/index',
                        meta: { title: '侧边栏二', icon: 'iconfont xx-question', requireAuth: true },
                        component: () => import('@/views/mgr-organization-one/sub-aside-two/index.vue'),
                    },
                    {
                        name: 'mgr-organization-one-father',
                        path: '/sys/organization/mgr/organization/one/father',
                        component: () => import('@/layout/basic-sub-aside.vue'),
                        children: [
                            {
                                name: 'sys-classes-mgr-organization-one-sub-aside-one',
                                path: '/sys/classes/mgr-organization-one/sub-aside-one/index',
                                meta: { title: '侧边栏一', icon: 'iconfont xx-question', requireAuth: true },
                                component: () => import('@/views/mgr-organization-one/sub-aside-one/index.vue'),
                            },
                            {
                                name: 'sys-classes-mgr-organization-one-sub-aside-three',
                                path: '/sys/classes/mgr-organization-one/sub-aside-three/index',
                                meta: { title: '侧边栏三', icon: 'iconfont xx-question', requireAuth: true },
                                component: () => import('@/views/mgr-organization-one/sub-aside-three/index.vue'),
                            },
                            {
                                name: 'sys-classes-mgr-organization-one-sub-aside-four',
                                path: '/sys/classes/mgr-organization-one/sub-aside-four/index',
                                meta: { title: '侧边栏四', icon: 'iconfont xx-question', requireAuth: true },
                                component: () => import('@/views/mgr-organization-one/sub-aside-four/index.vue'),
                            },
                        ]
                    },
                ]
            },
            {
                name: 'sys-def-mgr-organization-three',
                path: '/sys/def/mgr-organization-three/index',
                meta: { title: '管理端组织机构三', icon: 'iconfont xx-question', requireAuth: true },
                component: () => import('@/views/mgr-organization-three/index.vue'),
            },
            {
                name: 'sys-arrangement-user-teacher-two',
                path: '/sys/arrangement/user-teacher-two/index',
                meta: { title: '用户端教师二', icon: 'iconfont xx-question', requireAuth: true },
                component: () => import('@/views/user-teacher-two/index.vue'),
            },
            {
                name: 'sys-def-user-student-two',
                path: '/sys/def/user-student-two/index',
                meta: { title: '用户端学生二', icon: 'iconfont xx-question', requireAuth: true },
                component: () => import('@/views/user-student-two/index.vue'),
            },
        ]
    },
];

export const teacherRouterArr = [
    {
        name: 'home-component',
        path: '/teacher/component/home/component',
        component: () => import('@/layout/basic-first-header.vue'),
        children: [
            {
                name: 'teacher-teaching-user-teacher-one',
                path: '/teacher/teaching/user-teacher-one/index',
                meta: { title: '用户端教师一', icon: 'iconfont xx-question', requireAuth: true },
                component: () => import('@/views/user-teacher-one/index.vue'),
            },
            {
                name: 'teacher-arrangement-user-teacher-two',
                path: '/teacher/arrangement/user-teacher-two/index',
                meta: { title: '用户端教师二', icon: 'iconfont xx-question', requireAuth: true },
                component: () => import('@/views/user-teacher-two/index.vue'),
            },
        ]
    },
];

export const studentRouterArr = [
    {
        name: 'student-studying-user-student-one',
        path: '/student/studying/user-student-one/index',
        meta: { title: '用户端学生一', icon: 'iconfont xx-question', requireAuth: true },
        component: () => import('@/views/user-student-one/index.vue'),
    },
    {
        name: 'home-component',
        path: '/student/component/home/component',
        component: () => import('@/layout/basic-first-header.vue'),
        children: [
            {
                name: 'student-def-user-student-two',
                path: '/student/def/user-student-two/index',
                meta: { title: '用户端学生二', icon: 'iconfont xx-question', requireAuth: true },
                component: () => import('@/views/user-student-two/index.vue'),
            },
        ]
    },
];

