/// <reference types="vite/client" />

declare module "*.vue" {
    import { App, defineComponent } from "vue";
    const component: ReturnType<typeof defineComponent> & {
        install(app: App): void;
    };
    export default component;
}

declare module "./src/router/router-list.js" {
    export const studentRouterArr: any[];
    export const sysRouterArr: any[];
    export const teacherRouterArr: any[];
}
