<template>
    <div className="login-container">
        <div className="login-box">
            <div className="login-left">
                <img :src="loginLeft" alt="login" />
            </div>
            <div className="login-form">
                <div className="login-logo">
                    <img :src="logo" alt="logo" className="login-icon" />
                    <span className="logo-text">Temp-Vue</span>
                </div>
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="60px" class="demo-ruleForm" :size="formSize" status-icon>
                    <el-form-item label="账号" prop="username">
                        <el-input v-model="ruleForm.username" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="ruleForm.password" />
                    </el-form-item>
                    <el-form-item style="paddingLeft: 148px">
                        <el-button type="primary" @click="submitForm(ruleFormRef)">
                            登录
                        </el-button>
                        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                    </el-form-item>
                </el-form>
                <div style="display: flex; justifyContent: space-around">
                    <template v-if="userIdentity == 'teacher'">
                        <el-button :type="teachingBtnType" @click="_onBtnClick('teaching')">课程教学</el-button>
                        <el-button :type="arrangemenBtnType" @click="_onBtnClick('arrangement')">课程制作</el-button>
                    </template>

                    <template v-else-if="userIdentity == 'sys'">
                        <el-button :type="organizationBtnType" @click="_onBtnClick('organization')">组织机构</el-button>
                        <el-button :type="classesBtnType" @click="_onBtnClick('classes')">班级管理</el-button>
                    </template>

                    <template v-else>
                        <el-button type="primary">学生学习</el-button>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <div class="login-wrapper">

    </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import loginLeft from '@/assets/login_left.png'
import logo from "@/assets/avatar.png"

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
// 用户身份
const userIdentity = ref<string>("teacher")
// 教师端 platform 按钮
const arrangemenBtnType = ref<string>("default")
const teachingBtnType = ref<string>("primary")

const organizationBtnType = ref<string>("primary")
const classesBtnType = ref<string>("default")

const ruleForm = reactive({
    username: 'username',
    password: 'password',
})
const $route = useRouter();

onMounted(() => {
    // console.log("router.name", $route.currentRoute.value.name, $route);
    const routerNameStr = $route.currentRoute.value.name as string;
    const [identity, platform] = routerNameStr.split("-");
    userIdentity.value = identity;
    switch (platform) {
        case "teaching":
            teachingBtnType.value = "primary";
            arrangemenBtnType.value = "default";
            break;
        case "arrangement":
            teachingBtnType.value = "default";
            arrangemenBtnType.value = "primary";
            break;
        case "organization":
            organizationBtnType.value = "primary";
            classesBtnType.value = "default";
            break;
        case "classes":
            organizationBtnType.value = "default";
            classesBtnType.value = "primary";
            break;
        default:
            break;
    }
})

const rules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            try {
                switch (userIdentity.value) {
                    case 'teacher':
                        $route.push({ name: "teacher-teaching-user-teacher-one" });
                        break;
                    case 'student':
                        $route.push({ name: "student-def-user-student-two" });
                        break;
                    case 'sys':
                        $route.push({ name: "sys-classes-mgr-organization-one-sub-aside-one" });
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.log(error);

            }

        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const _onBtnClick = (type: string) => {
    switch (type) {
        case "arrangement":
            $route.push({ name: "teacher-arrangement" });
            teachingBtnType.value = "default";
            arrangemenBtnType.value = "primary";
            break;
        case "teaching":
            $route.push({ name: "teacher-teaching" });
            teachingBtnType.value = "primary";
            arrangemenBtnType.value = "default";
            break;
        case "organization":
            $route.push({ name: "sys-organization" });
            organizationBtnType.value = "primary";
            classesBtnType.value = "default";
            break;
        case "classes":
            $route.push({ name: "sys-classes" });
            organizationBtnType.value = "default";
            classesBtnType.value = "primary";
            break;
        default:
            break;
    }
}
</script>

<style lang="scss">
.login-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 550px;
    height: 100%;
    min-height: 500px;
    background-image: url("@/assets/login_bg.svg");
    background-position: 50%;
    background-size: 100% 100%;
    background-size: cover;

    .dark {
        position: absolute;
        top: 5%;
        right: 3.2%;
    }

    .login-box {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 96%;
        height: 94%;
        padding: 0 4% 0 20px;
        overflow: hidden;
        border-radius: 10px;

        .login-left {
            width: 750px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .login-form {
            padding: 40px 45px 25px;
            border-radius: 10px;
            box-shadow: 0 0 6px 0 #ccc;

            .login-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 40px;

                .login-icon {
                    width: 70px;
                }

                .logo-text {
                    padding-left: 25px;
                    font-size: 48px;
                    font-weight: bold;
                    white-space: nowrap;
                }
            }

            .ant-form-item {
                height: 75px;
                margin-bottom: 0;

                .ant-input-prefix {
                    margin-right: 10px;
                }

                .ant-input-affix-wrapper-lg {
                    padding: 8.3px 11px;
                }

                .ant-input-affix-wrapper,
                .ant-input-lg {
                    font-size: 14px;
                }

                .ant-input-affix-wrapper {
                    color: #bfbfbf;
                }
            }

            .login-btn {
                width: 100%;
                margin-top: 10px;
                white-space: nowrap;

                .ant-form-item-control-input-content {
                    display: flex;
                    justify-content: space-between;

                    .ant-btn {
                        width: 180px;

                        span {
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }
}
</style>