const FS = require('fs')
const PATH = require('path')

const configJson = FS.readFileSync(PATH.join(process.cwd(), 'router-config.json'), 'utf-8')
const { entry, output, identities, alias } = JSON.parse(configJson)
// console.log(entry, output, identities);

const BASE_PATH = entry;
const ROUTE_PATH = PATH.resolve(output);
const BASE_PATH_ALIAS = alias || PATH.resolve(BASE_PATH);
const BASE_IDENTITIES_ARR = identities;

let mainConfigJson = FS.readFileSync(PATH.join(PATH.resolve(BASE_PATH), 'config.json'), 'utf-8');
// console.log(mainConfigJson);

// 返回 models目录下所有 config.json 所指定的路由名称及其组件访问路径
let finallyArr = []

/**
 * @param {String} name 配置名称
 * @param {Object} parseItem 配置的父配置
 * @param {String} identity 身份
 * @param {object} meta 路由携带的一些参数 例如 meta: {title: '我的课程', icon: 'dxo iconfont icon'}
*/
class ParseItem {
  constructor(name, parseItem, identity, meta,) {
    if (parseItem) {
      this.path = PATH.join(parseItem.path, name === 'index' ? name + '.vue' : name)
      this.name = parseItem.name + "-" + name
    } else {
      this.path = PATH.resolve(BASE_PATH, name)
      this.name = name
    }
    this.children = []
    this.identity = identity
    this.meta = JSON.parse(JSON.stringify(meta))

    try {
      this.stat = FS.statSync(this.path)
    } catch (error) {
      throw Error(`>>>>>>>>>>>>${this.path}路径下没有${name}文件或文件夹>>>>>>>>>>>>>`)
    }
  }

  isDirectory() {
    return this.stat.isDirectory()
  }

  isFile() {
    return this.stat.isFile()
  }
}

// 存储每一个有 config.json 的文件夹对象
let tempDirItem = undefined

// 找出所有 src 目录下的config.json并根据它的路径拼凑出路由信息
function findJson(parseJson, prevParseItem) {
  const { name: jsonName, component: jsonComponent, list } = parseJson
  // 判断是否有父组件 component
  // if (jsonComponent) {
  //   if (!jsonName) throw new Error(`配置了 component【${jsonComponent}】的 config.json 文件中没有 name 属性！`)
  // }

  for (let item of list) {
    // console.log('title, icon', item.name, item.label, item.icon);
    let parseItem = new ParseItem(
      item.name,
      prevParseItem,
      item.identities,
      { title: item?.meta?.title, icon: item?.meta?.icon, requireAuth: item?.meta?.requireAuth }
    )

    prevParseItem && prevParseItem.children.push({
      name: parseItem.name,
      path: parseItem.path,
      identity: parseItem.identity,
      children: parseItem.children,
      meta: parseItem.meta
    })

    if (parseItem.isDirectory()) {
      // FS.access 返回一个Promise，故是异步方法，
      // FS.accessSync 是同步方法

      try {
        FS.accessSync(PATH.join(parseItem.path, 'config.json'), FS.constants.F_OK)
        tempDirItem = parseItem
        const configJson = FS.readFileSync(PATH.join(parseItem.path, 'config.json'), 'utf-8')
        findJson(JSON.parse(configJson), parseItem)
      } catch (error) {
        // src目录下的 config.json 文件中指向的没有子路由的 index.vue 文件
        try {
          FS.accessSync(PATH.join(parseItem.path, 'index.vue'), FS.constants.F_OK)

          // let tempCover = {}
          const temp = { name: parseItem.name + '-index', path: PATH.join(parseItem.path, 'index.vue'), children: parseItem.children, identity: parseItem.identity, meta: parseItem.meta }
          // 判断是否有父组件 component
          // if (jsonComponent) {
          //   if (!jsonName) throw new Error(`配置了 component【${jsonComponent}】的 config.json 文件中没有 name 属性！`)
          //   tempCover = {
          //     name: jsonName,
          //     path: 'basic-component',
          //     component: jsonComponent,
          //     hasComponent: true,
          //     meta: {},
          //     identity: BASE_IDENTITIES_ARR,
          //     children: temp
          //   }
          // }

          finallyArr.push(temp)
        } catch (error) {
          throw new Error(`${parseItem.path}路径下，没有index.vue 文件`)
        }
      }

    } else if (parseItem.isFile()) {
      if (finallyArr.flat(Infinity).map(item => (item.name)).some((ele) => tempDirItem.name.includes(ele))) return
      // src目录下的 config.json 文件中指向的有子路由的 index.vue 文件
      try {
        FS.accessSync(PATH.join(tempDirItem.path, 'index.vue'), FS.constants.F_OK)
      } catch (error) {
        throw new Error(`${tempDirItem.path}路径下，没有index.vue 文件`)
      }

      // let tempCover = {}
      let temp = { name: tempDirItem.name + '-index', path: PATH.join(tempDirItem.path, 'index.vue'), children: tempDirItem.children, identity: tempDirItem.identity, meta: tempDirItem.meta }
      // 判断是否有父组件 component
      // if (jsonComponent) {
      //   if (!jsonName) throw new Error(`配置了 component【${jsonComponent}】的 config.json 文件中没有 name 属性！`)
      //   tempCover = {
      //     name: jsonName,
      //     path: 'basic-component',
      //     component: jsonComponent,
      //     hasComponent: true,
      //     meta: {},
      //     identity: BASE_IDENTITIES_ARR,
      //     children: temp
      //   }
      // }

      finallyArr.push(temp)
    } else {
      throw Error('找不到文件')
    }
  }
}
findJson(JSON.parse(mainConfigJson));

// 先遍历所有身份，生成对应身份的路由
// 按照身份生成的路由对象
const router = {}
// 将上面的路由对象转换成字符串形式，方便写入文件
const routerStr = {}
function identityRoute(arr, identity) {
  router[identity] = []
  for (let item of arr) {
    if (item.identity.length <= 0 || !item.identity) throw new Error(`${item.path}路径下身份数组为空或不存在！`)
    if ([...new Set([...BASE_IDENTITIES_ARR, ...item.identity])].length > BASE_IDENTITIES_ARR.length) throw new Error(`${item.path}你所写的身份，不存在于身份数组中！`)

    router[identity].push(item)
  }
  // 过滤掉身份数组中不含有指定身份的项
  router[identity] = router[identity].filter(item => item.identity.includes(identity))
}


// 先遍历所有身份，生成对应身份的路由
BASE_IDENTITIES_ARR.forEach((identity) => identityRoute(finallyArr, identity))
Object.keys(router).forEach((identity) => {
  routerStr[identity] = getResult(router[identity], identity)
})

// 传入数组，并生成字符串格式
function getResult(arr, identity) {
  // 生成字符串，写入文件
  let result = '['
  let indent = 1
  let space = number => new Array(number).fill(' ').join('')

  for (let item of arr) {
    // name
    result = `${result}\n${space(indent * 4)}{`
    result = `${result}\n${space(indent * 8)}name: \'${item.name}\',`

    // path
    result = `${result}\n`
    result = `${result}${space(indent * 8)}path: \'${item.path.replace(PATH.resolve(BASE_PATH), '/:identity').replaceAll('\\', '/').replace('.vue', '')}\',`

    // identity
    // result = `${result}\n`
    // result = `${result}${space(indent * 8)}identity: ${JSON.stringify(item.identity)},`

    // meta
    if (JSON.stringify(item.meta) !== '{}') {
      result = `${result}\n`
      result = `${result}${space(indent * 8)}meta: { `
      if (item.meta.title) {
        result = `${result}title: \'${item.meta.title}\', `
      }
      if (item.meta.icon) {
        result = `${result}icon: \'${item.meta.icon}\', `
      }
      if (item.meta.requireAuth) {
        result = `${result}requireAuth: true`
      } else {
        result = `${result}requireAuth: false`
      }
      result = `${result}},`
    }

    // if (item.hasComponent) {
    //   // component
    //   result = `${result}\n`
    //   result = `${result}${space(indent * 8)}component: resolve => {require([\'${item.component}\'], resolve)},`
    // } else {
    // component
    result = `${result}\n`
    result = `${result}${space(indent * 8)}component: resolve => {require([\'${item.path.replace(PATH.resolve(BASE_PATH), BASE_PATH_ALIAS).replaceAll('\\', '/')}\'], resolve)},`
    // }

    // children
    if (item.children.length > 0) {
      // component
      result = `${result}\n`
      result = `${result}${space(indent * 8)}children: ${stringifyChildren(item.children)}},`
    } else {
      result = `${result}\n${space(indent * 8 - 4)}},`
    }
  }

  result = `export const ${identity}RouterArr = ${result}\n];`
  return result;

  // 这个方法是会返回一个字符串的
  function stringifyChildren(children) {
    indent++;
    let result = '['
    for (let item of children) {
      // name
      result = `${result}\n${space(indent * 8 - 4)}{`
      result = `${result}\n${space(indent * 8)}name: \'${item.name}\',`

      // path
      // if (!item.hasComponent) {
      result = `${result}\n`
      result = `${result}${space(indent * 8)}path: \'${item.path.replace(PATH.resolve(BASE_PATH), '/:identity').replaceAll('\\', '/').replace('.vue', '')}\',`
      // }

      // identity
      // result = `${result}\n`
      // result = `${result}${space(indent * 8)}identity: ${JSON.stringify(item.identity)},`

      // meta
      if (JSON.stringify(item.meta) !== '{}') {
        result = `${result}\n`
        result = `${result}${space(indent * 8)}meta: { `
        if (item.meta.title) {
          result = `${result}title: \'${item.meta.title}\', `
        }
        if (item.meta.icon) {
          result = `${result}icon: \'${item.meta.icon}\', `
        }
        if (item.meta.requireAuth) {
          result = `${result}requireAuth: true`
        } else {
          result = `${result}requireAuth: false`
        }
        result = `${result}},`
      }

      // if (item.hasComponent) {
      //   // component
      //   result = `${result}\n`
      //   result = `${result}${space(indent * 8)}component: resolve => {require([\'${item.component}\'], resolve)},`
      // } else {
      // component
      result = `${result}\n`
      result = `${result}${space(indent * 8)}component: resolve => {require([\'${item.path.replace(PATH.resolve(BASE_PATH), BASE_PATH_ALIAS).replaceAll('\\', '/')}\'], resolve)},`
      // }

      // children
      if (item.children.length > 0) {
        // component
        result = `${result}\n`
        result = `${result}${space(indent * 8)}children: ${stringifyChildren(item.children)}},`
      } else {
        result = `${result}\n${space(indent * 8 - 4)}},`
      }
    }
    result = `${result}\n${space(indent * 4)}]`
    indent = 1
    return result
  }
}

let finalRouterStr = ''
Object.keys(routerStr).forEach((identity) => {
  finalRouterStr = `${finalRouterStr}${routerStr[identity]}\n\n`
})
FS.writeFileSync(ROUTE_PATH, finalRouterStr);


