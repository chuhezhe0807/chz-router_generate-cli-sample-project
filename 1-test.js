const FS = require("fs");
const PATH = require("path");

// // 读取 配置JSON文件 入口
// const BASE_FILE_ENTRY = "./src/views/";
// // 入口路径的别名 写component路径时使用 (注意不带 "/")
// const BASE_PATH_ALIAS = "@/views";
// // 项目 src 路径的别名 用于替换使用了项目根路径的路径
// const PROJECT_SRC_ALIAS = "@/";
// // 输出路由配置文件路径
// const BASE_OUTPUT_PATH = "./router-list.js";
// // 所有的身份，用于判断身份数组是否写错
// const BASE_IDENTITIES_ARR = ["sys", "teacher", "student"];

// 读取路由配置
try {
    FS.readFileSync(PATH.join(process.cwd(), "router-config.json"), "utf-8");
} catch (error) {
    throw Error("请在项目根目录下添加名为 router-config.json 的json配置文件，其中配置请查阅 README.md");
}

const {
    entry: BASE_FILE_ENTRY,
    entry_alias: BASE_PATH_ALIAS,
    project_alias: PROJECT_SRC_ALIAS,
    output: BASE_OUTPUT_PATH,
    identities: BASE_IDENTITIES_ARR,
} = JSON.parse(FS.readFileSync(PATH.join(process.cwd(), "router-config.json"), "utf-8"));

/**
 * @description 遍历解析 config.json 文件
 * @param {string} path 需要解析的路径
 * @param {string} name 上一个 config.json 的name
 * @param {number} depth 递归的层级（路由name拼接 platfrom 时,只有入口 config.json 文件才会配置platform）
 */
function backtracking(path, name, depth) {
    let fileCfg;
    try {
        fileCfg = FS.readFileSync(PATH.join(path, "config.json"), "utf-8");
    } catch (error) {
        // console.log(error);
        return [];
    }

    const { exclude, list, component, name: fatherName } = JSON.parse(fileCfg);
    let temp = [];
    if (exclude.length) {
        for (let item of exclude) {
            const index = list.findIndex(ele => ele.name == item);
            const tempName = depth ? `${name}-${list[index].name}` : `${name}-${list[index]?.platform ? list[index].platform : "def"}-${list[index].name}`;

            // 如果遍历的路径下不存在 index.vue 文件
            try {
                FS.readFileSync(PATH.resolve(PATH.join(path, list[index].name, "index.vue")));
            } catch (error) {
                throw Error(`${PATH.resolve(PATH.join(path, list[index].name))} 路径下没有 index.vue 文件`);
            }

            temp.push({
                ...list[index],
                name: tempName,
                path: PATH.resolve(PATH.join(path, list[index].name)),
                children: backtracking(PATH.join(path, list[index].name), tempName, depth + 1),
            });
            list.splice(index, 1);
        }
    }

    temp.push({
        name: fatherName,
        path: `/${fatherName.split("-").join("/")}`,
        component,
        children: list.map(item => {
            const tempName = depth ? `${name}-${item.name}` : `${name}-${item?.platform ? item.platform : "def"}-${item.name}`;

            // 如果遍历的路径下不存在 index.vue 文件
            try {
                FS.readFileSync(PATH.resolve(PATH.join(path, item.name, "index.vue")));
            } catch (error) {
                throw Error(`${PATH.resolve(PATH.join(path, item.name))} 路径下没有 index.vue 文件`);
            }

            return {
                ...item,
                name: tempName,
                path: PATH.resolve(PATH.join(path, item.name)),
                children: backtracking(PATH.join(path, item.name), tempName, depth + 1),
            };
        }),
        isFatherComp: true,
    });

    return temp;
}

// 获取遍历出的所有路由配置信息数组
const cfgInfoArr = backtracking(BASE_FILE_ENTRY, "${identity}", 0);

// 先遍历所有身份，生成对应身份的路由
// 按照身份生成的路由对象
const router = {};
// 将上面的路由对象转换成字符串形式，方便写入文件
const routerStr = {};
function identityRoute(arr, identity) {
    let res = [];
    for (let item of arr) {
        if (item.isFatherComp) {
            res.push({
                ...item,
                children: identityRoute(item.children, identity),
            });
            continue;
        }

        if (!item.identities || item.identities.length <= 0) throw new Error(`${item.path}路径下身份数组为空或不存在！`);
        if ([...new Set([...BASE_IDENTITIES_ARR, ...item.identities])].length > BASE_IDENTITIES_ARR.length) throw new Error(`${item.path}你所写的身份，不存在于身份数组中！`);

        if (item.identities.includes(identity)) {
            res.push({
                ...item,
                name: item.name.replace("${identity}", identity),
                children: item.children.length ? identityRoute(item.children, identity) : [],
            });
        }
    }

    return res;
}

// 先遍历所有身份，生成对应身份的路由
BASE_IDENTITIES_ARR.forEach(identity => {
    router[identity] = identityRoute(cfgInfoArr, identity);
});
Object.keys(router).forEach(identity => {
    routerStr[identity] = getResult(router[identity], identity);
});

// 传入数组，并生成字符串格式
function getResult(arr, identity) {
    // 生成字符串，写入文件
    let result = "[";
    let indent = 1;
    let space = number => new Array(number).fill(" ").join("");

    for (let item of arr) {
        // 如果是路由的父组件
        if (item.isFatherComp) {
            try {
                FS.readFileSync(PATH.resolve(item.component.replace(PROJECT_SRC_ALIAS, "./src/")));
            } catch (error) {
                throw Error(`${item.path} 路径下的 config.json 文件中设置的 component 对应的路径找不到，请设置为相对于项目根路径的路径，最好使用项目根路径别名`);
            }

            // name
            result = `${result}\n${space(indent * 4)}{`;
            result = `${result}\n${space(indent * 8)}name: \'${item.name}\',`;

            // path
            result = `${result}\n`;
            result = `${result}${space(indent * 8)}path: \'\/${identity}\/${item.name.split("-")[1]}${item.path}\',`;
            // result = `${result}${space(indent * 8)}path: \'\/:identity\/:platform${item.path}\',`;

            // component
            // result = `${result}\n`;
            // result = `${result}${space(indent * 8)}component: \'${item.component}\',`;
            // component
            result = `${result}\n`;
            result = `${result}${space(indent * 8)}component: () => import(\'${item.component}\'),`;
            // vite 不支持 require 语法， webpack 支持
            // result = `${result}${space(indent * 8)}component: resolve => {require([\'${item.component}\'], resolve)},`;

            // children
            result = `${result}\n`;
            result = `${result}${space(indent * 8)}children: ${stringifyChildren(item.children, identity)}},`;

            continue;
        }

        // name
        result = `${result}\n${space(indent * 4)}{`;
        result = `${result}\n${space(indent * 8)}name: \'${item.name}\',`;

        // path
        result = `${result}\n`;
        result = `${result}${space(indent * 8)}path: \'${item.path
            .replace(PATH.resolve(BASE_FILE_ENTRY), "/" + identity + "/" + item.name.split("-")[1])
            .replaceAll("\\", "/")
            .replace(".vue", "")}\/index\',`;
        // result = `${result}${space(indent * 8)}path: \'${item.path.replace(PATH.resolve(BASE_FILE_ENTRY), "/:identity/:platform").replaceAll("\\", "/").replace(".vue", "")}\/index\',`;

        // identity
        // result = `${result}\n`
        // result = `${result}${space(indent * 8)}identity: ${JSON.stringify(item.identity)},`

        // meta
        if (JSON.stringify(item.meta) !== "{}") {
            result = `${result}\n`;
            result = `${result}${space(indent * 8)}meta: { `;
            if (item.meta.title) {
                result = `${result}title: \'${item.meta.title}\', `;
            }
            if (item.meta.icon) {
                result = `${result}icon: \'${item.meta.icon}\', `;
            }
            if (item.meta.requireAuth) {
                result = `${result}requireAuth: true`;
            } else {
                result = `${result}requireAuth: false`;
            }
            result = `${result}},`;
        }

        // component
        result = `${result}\n`;
        result = `${result}${space(indent * 8)}component: () => import(\'${item.path.replace(PATH.resolve(BASE_FILE_ENTRY), BASE_PATH_ALIAS).replaceAll("\\", "/")}\/index.vue\'),`;
        // result = `${result}${space(indent * 8)}component: resolve => {require([\'${item.path.replace(PATH.resolve(BASE_FILE_ENTRY), BASE_PATH_ALIAS).replaceAll("\\", "/")}\/index.vue\'], resolve)},`;
        // }

        // children
        if (item.children.length > 0) {
            // children
            result = `${result}\n`;
            result = `${result}${space(indent * 8)}children: ${stringifyChildren(item.children, identity)}},`;
        } else {
            result = `${result}\n${space(indent * 8 - 4)}},`;
        }
    }

    result = `export const ${identity}RouterArr = ${result}\n];`;
    return result;

    // 这个方法是会返回一个字符串的
    function stringifyChildren(children, identity) {
        indent++;
        let result = "[";
        for (let item of children) {
            // 如果是路由的父组件
            if (item.isFatherComp) {
                try {
                    FS.readFileSync(PATH.resolve(item.component.replace(PROJECT_SRC_ALIAS, "./src/")));
                } catch (error) {
                    throw Error(`${item.path} 路径下的 config.json 文件中设置的 component 对应的路径找不到，请设置为相对于项目根路径的路径，最好使用项目根路径别名`);
                }

                // name
                result = `${result}\n${space(indent * 4)}{`;
                result = `${result}\n${space(indent * 8)}name: \'${item.name}\',`;

                // path
                result = `${result}\n`;
                result = `${result}${space(indent * 8)}path: \'\/${identity}\/${item.name.split("-")[1]}${item.path}\',`;
                // result = `${result}${space(indent * 8)}path: \'\/:identity\/:platform${item.path}\',`;

                // component
                // result = `${result}\n`;
                // result = `${result}${space(indent * 8)}component: \'${item.component}\',`;
                result = `${result}\n`;
                result = `${result}${space(indent * 8)}component: () => import(\'${item.component}\'),`;
                // result = `${result}${space(indent * 8)}component: resolve => {require([\'${item.component}\'], resolve)},`;

                // children
                result = `${result}\n`;
                result = `${result}${space(indent * 8)}children: ${stringifyChildren(item.children, identity)}},`;

                continue;
            }

            // name
            result = `${result}\n${space(indent * 8 - 4)}{`;
            result = `${result}\n${space(indent * 8)}name: \'${item.name}\',`;

            // path
            // if (!item.hasComponent) {
            result = `${result}\n`;
            result = `${result}${space(indent * 8)}path: \'${item.path
                .replace(PATH.resolve(BASE_FILE_ENTRY), "/" + identity + "/" + item.name.split("-")[1])
                .replaceAll("\\", "/")
                .replace(".vue", "")}\/index\',`;
            // }

            // identity
            // result = `${result}\n`
            // result = `${result}${space(indent * 8)}identity: ${JSON.stringify(item.identity)},`

            // meta
            if (JSON.stringify(item.meta) !== "{}") {
                result = `${result}\n`;
                result = `${result}${space(indent * 8)}meta: { `;
                if (item.meta.title) {
                    result = `${result}title: \'${item.meta.title}\', `;
                }
                if (item.meta.icon) {
                    result = `${result}icon: \'${item.meta.icon}\', `;
                }
                if (item.meta.requireAuth) {
                    result = `${result}requireAuth: true`;
                } else {
                    result = `${result}requireAuth: false`;
                }
                result = `${result}},`;
            }

            // component
            result = `${result}\n`;
            result = `${result}${space(indent * 8)}component: () => import(\'${item.path.replace(PATH.resolve(BASE_FILE_ENTRY), BASE_PATH_ALIAS).replaceAll("\\", "/")}\/index.vue\'),`;
            // result = `${result}${space(indent * 8)}component: resolve => {require([\'${item.path
            //     .replace(PATH.resolve(BASE_FILE_ENTRY), BASE_PATH_ALIAS)
            //     .replaceAll("\\", "/")}\/index.vue\'], resolve)},`;
            // }

            // children
            if (item.children.length > 0) {
                // component
                result = `${result}\n`;
                result = `${result}${space(indent * 8)}children: ${stringifyChildren(item.children, identity)}},`;
            } else {
                result = `${result}\n${space(indent * 8 - 4)}},`;
            }
        }
        result = `${result}\n${space(indent * 4)}]`;
        indent = 1;
        return result;
    }
}

// 每个身份数组之间换行
let finalRouterStr = "";
Object.keys(routerStr).forEach(identity => {
    finalRouterStr = `${finalRouterStr}${routerStr[identity]}\n\n`;
});

FS.writeFileSync(BASE_OUTPUT_PATH, finalRouterStr);
