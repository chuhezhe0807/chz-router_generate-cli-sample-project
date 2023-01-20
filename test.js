const FS = require('fs')
const PATH = require('path')

// 读取指定位置的的配置文件
const configJson = FS.readFileSync(PATH.join(process.cwd(), 'router-config.json'), 'utf-8')
const { entry, output, identities, alias } = JSON.parse(configJson)
// console.log(entry, output, identities);

const BASE_PATH = entry;
const ROUTE_PATH = PATH.resolve(output);
const BASE_PATH_ALIAS = alias || PATH.resolve(BASE_PATH);
const BASE_IDENTITIES_ARR = identities;

// config.json 入口
let mainConfigJson = FS.readFileSync(PATH.join(PATH.resolve(BASE_PATH), 'config.json'), 'utf-8');
// console.log(mainConfigJson);
// 解析后的路由list
let routerList = []

/**
 * @description 解析遇到的 config.json 文件
 * @param {String}  name      该config.json中的名称字段，用于给路由命名
 * @param {String}  component 当在该config.json中，对 list 中的路由使用父组件时，父组件的引用地址
 * @param {Array}   exclude   对 list 中的路由使用父组件时，排出的list中的路由
 * @param {Array}   list      指向下一级的子路由列表
 * 
 * @param {String} filePath   当前解析的 config.json 文件的绝对路径，用于错误处理
 * 
 * @param {Boolean} hasCfgJson  由父 config.json 解析所指向的文件夹中时，该文件夹是否存在 config.json 文件，若存在 则不需生成 index 路由，使用 component 所指定的组件代替（必须带有 router-view 组件）
*/
class ParseJson {
  constructor({ name, component, exclude = [], list }, filePath, hasCfgJson) {
    this.name = name;
    this.component = component;
    if (this.component && !this.name) throw new Error('对于list中的路由使用父组件时，需提供name属性')

    this.exclude = exclude;
    this.list = list;
    this.filePath = filePath;
  }

  // get 不能传参，调用时不接括号，this可以获取实例
  /**
   * @description 获取当前解析的这个 config.json 文件中对应的路由list
   * @returns {Array} name path component identities meta 
  */
  get routerArr() {
    let tempList = this.list.map((item) => {
      item.path = PATH.join(this.filePath, item.name);
      item.children = [];
      return item;
    })

    if (this.component) {
      tempList = [
        {
          name: this.name,
          component: this.component,
          path: this.filePath,
          // 如是路由父组件，则在序列化为字符串时不需要处理
          isFatherCmp: true,
          children: [...tempList],
          identities: BASE_IDENTITIES_ARR
        }
      ]

      if (this.exclude.length > 0) {
        const list = JSON.parse(JSON.stringify(tempList[0].children))
        for (let item of list) {
          if (this.exclude.includes(item.name)) {
            tempList[0].children = tempList[0].children.filter(ele => !this.exclude.includes(ele.name))
            tempList.unshift(item)
          }
        }
      }

      // hasCfgJson
      // if (hasCfgJson) {
      //   tempList = []
      // }
    }

    return tempList
  }
}

/**
 * @description 解析 list 中的路由路径
 * @param {Array}   list      待解析的数组，
 * @param {Object}  prevItem  递归时使用，父 config.json 文件
 * @param {String}  existPath  递归时使用，由父 config.json 解析所指向的文件夹中时，该文件夹存在 config.json 文件，则需要使用此 prevPath 为拼接路径
*/
function parseList(item, prevItem, existPath) {
  // const prevPath = existPath ? existPath : (prevItem?.path || BASE_PATH);
  let result = undefined;
  const prevPath = prevItem?.path || BASE_PATH;

  const absolutePath = PATH.resolve(prevPath, item.name);
  if (FS.statSync(absolutePath).isDirectory()) {

    // 1、判断 item.name 下是否有 index.vue 文件
    try {
      FS.accessSync(PATH.join(absolutePath, 'index.vue'), FS.constants.F_OK)
    } catch (error) {
      throw new Error(`${PATH.join(absolutePath, 'index.vue')} 文件不存在！`)
    }

    // 2、判断 absolutePath 路径下是否存在 config.json 文件，即是否存在子路由
    let itemJson = undefined;
    try {
      itemJson = FS.readFileSync(PATH.join(absolutePath, 'config.json'), 'utf-8')
    } catch (error) {
      // 没有 config.json 文件
      // console.log(item.name, prevItem);
      if (prevItem) {
        prevItem.children.push(item)
      } else {
        routerList.push(item)
      }
    }


  } else {
    throw new Error(`${absolutePath} 此路径下无文件夹！`)
  }
}

function deepParseList(list, prevItem) {
  for (let item of list) {
    // 如果是有 component 的父组件
    if (item.isFatherCmp) {
      return parseList(item)
    }
  }
}

const firstJson = new ParseJson(JSON.parse(mainConfigJson), PATH.resolve(BASE_PATH))
// deepParseList(firstJson.routerArr)

FS.writeFileSync(ROUTE_PATH, JSON.stringify(firstJson.routerArr, null, 4));