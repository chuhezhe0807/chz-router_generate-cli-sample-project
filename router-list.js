[
    {
        "name": "user-student-one",
        "meta": {
            "icon": "iconfont xx-question",
            "title": "用户端学生一",
            "requireAuth": true
        },
        "identities": [
            "sys",
            "student"
        ],
        "path": "D:\\vscode\\Demo\\temp_vue\\src\\views\\user-student-one",
        "children": []
    },
    {
        "name": "mgr-organization-two",
        "meta": {
            "icon": "iconfont xx-question",
            "title": "管理端组织机构二",
            "requireAuth": true
        },
        "identities": [
            "sys"
        ],
        "path": "D:\\vscode\\Demo\\temp_vue\\src\\views\\mgr-organization-two",
        "children": []
    },
    {
        "name": "@/",
        "component": "@/layout/basic-first-header.vue",
        "path": "D:\\vscode\\Demo\\temp_vue\\src\\views",
        "isFatherCmp": true,
        "children": [
            {
                "name": "mgr-organization-one",
                "meta": {
                    "icon": "iconfont xx-question",
                    "title": "管理端组织机构一",
                    "requireAuth": false
                },
                "identities": [
                    "sys"
                ],
                "path": "D:\\vscode\\Demo\\temp_vue\\src\\views\\mgr-organization-one",
                "children": []
            },
            {
                "name": "user-teacher-one",
                "meta": {
                    "icon": "iconfont xx-question",
                    "title": "用户端教师一",
                    "requireAuth": true
                },
                "identities": [
                    "sys",
                    "teacher"
                ],
                "path": "D:\\vscode\\Demo\\temp_vue\\src\\views\\user-teacher-one",
                "children": []
            },
            {
                "name": "user-teacher-two",
                "meta": {
                    "icon": "iconfont xx-question",
                    "title": "用户端教师二",
                    "requireAuth": true
                },
                "identities": [
                    "sys",
                    "teacher"
                ],
                "path": "D:\\vscode\\Demo\\temp_vue\\src\\views\\user-teacher-two",
                "children": []
            },
            {
                "name": "user-student-two",
                "meta": {
                    "icon": "iconfont xx-question",
                    "title": "用户端学生二",
                    "requireAuth": true
                },
                "identities": [
                    "sys",
                    "student"
                ],
                "path": "D:\\vscode\\Demo\\temp_vue\\src\\views\\user-student-two",
                "children": []
            }
        ],
        "identities": [
            "sys",
            "teacher",
            "student"
        ]
    }
]