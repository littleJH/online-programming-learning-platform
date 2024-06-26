import { IToc, TypeSideBar } from '@/type'
import { RcFile } from 'antd/es/upload'
import dayjs from 'dayjs'
import copy from 'copy-to-clipboard'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from './highlight'

const formatProblemJson = async (file: RcFile) => {
  const text = await file.text()
  const data = JSON.parse(text)
  switch (data.oj) {
    case 'POJ':
      const index = data.time_limit.search(/[A-z]|[a-z]/)
      data.time_unit = data.time_limit.slice(index).toLowerCase()
      data.time_limit = Number(data.time_limit.slice(0, index))
      const index1 = data.memory_limit.search(/[A-Z]|[a-z]/)
      data.memory_unit = data.memory_limit.slice(index1).toLowerCase()
      data.memory_unit.includes('b') ? null : (data.memory_unit = `${data.memory_unit}b`)
      data.memory_limit = Number(data.memory_limit.slice(0, index1))
      data.oj = 'POJ'
      data.sample_case = [
        {
          input: data.sample_case.sample_input,
          output: data.sample_case.sample_outpit,
        },
      ]
      break
    case 'ATCODER':
      break
    default:
      data.problem_id = String(data.id)
      delete data.id
      break
  }
  return data
}

const getPathArray = (path: string) => {
  const index = path.indexOf('?')
  const arr = path.slice(0, index > 0 ? index : path.length).split('/')
  arr.shift()
  return arr
}

const getQuerys = (path: string) => {
  const index = path.indexOf('?')
  const arr = path.slice(index + 1).split('&')
  const obj: any = {}
  arr.forEach((item) => {
    const [key, value] = item.split('=')
    obj[key] = value
  })
  return obj
}

const generateTOC = (container: HTMLElement) => {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const toc: IToc[] = []

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1)) // 获取标题级别，如从'h1'中提取出1
    const title = heading.textContent
    const node: IToc = { key: heading.id, title: title || '', children: [] }

    // 在目录树中找到正确的位置插入节点
    let currentNode = toc
    for (let i = 1; i < level; i++) {
      const lastChild = currentNode[currentNode.length - 1]
      if (lastChild) {
        currentNode = lastChild.children
      }
    }

    currentNode.push(node)
  })

  return toc
}

const getDuration = (start: string, end: string): string => {
  const mill = dayjs(end).unix() - dayjs(start).unix()
  const duration = {
    hour: 0,
    min: 0,
  }
  duration.hour = Math.floor(mill / 3600)
  duration.min = (mill - duration.hour * 3600) / 60

  return `${duration.hour} 小时 ${duration.min} 分钟`
}

const getSideBarType = (path: string): TypeSideBar => {
  console.log('path ==> ', path)
  const pathArr = utils.getPathArray(path)
  const siderNavPath = [
    '/problemset/all',
    '/problemset/topic',
    '/problemset/form',
    '/competition/common/set',
    '/competition/random',
    '/competition/standard',
    '/community/articleset',
    '/creation',
  ]
  const directoryPath = ['/community/article/']

  if (siderNavPath.includes(path) || path.includes('/profile')) {
    return 'nav'
  } else if (directoryPath.find((item) => path.includes(item))) {
    return 'directory'
  } else if (pathArr[0] === 'competition' && pathArr[3] === 'problem') {
    return 'competitionRank'
  } else {
    return 'none'
  }
}

const getTimeAgo = (time: string) => {
  let ago: {
    num: number
    unit: '秒' | '分钟' | '小时' | '天' | '月' | '年'
  }
  const previous = dayjs(time)
  const current = dayjs()
  const gap = current.unix() - previous.unix()
  if (gap <= 60) {
    ago = {
      num: gap + 1,
      unit: '秒',
    }
  } else if (gap > 60 && gap <= 60 * 60) {
    ago = {
      num: current.diff(previous, 'minute'),
      unit: '分钟',
    }
  } else if (gap > 60 * 60 && gap <= 60 * 60 * 24) {
    ago = {
      num: current.diff(previous, 'hour'),
      unit: '小时',
    }
  } else if (gap > 60 * 60 * 24 && gap <= 60 * 60 * 24 * 30) {
    ago = {
      num: current.diff(previous, 'day'),
      unit: '天',
    }
  } else if (gap > 60 * 60 * 24 * 30 && gap <= 60 * 60 * 24 * 365) {
    ago = {
      num: current.diff(previous, 'month'),
      unit: '月',
    }
  } else {
    ago = {
      num: current.diff(previous, 'year'),
      unit: '年',
    }
  }
  return ago
}

const debounce = (callback: Function, delay = 500, immediate = false) => {
  let timeout: ReturnType<typeof setTimeout>
  let immediateInvoke: boolean = true
  return function (this: any, args: any[]) {
    timeout ? clearTimeout(timeout) : null
    if (immediate) {
      if (immediateInvoke) {
        callback(...args)
        immediateInvoke = false
      } else {
        timeout = setTimeout(() => {
          callback(...args)
          immediateInvoke = true
        }, delay)
      }
    } else {
      timeout = setTimeout(() => {
        callback(...args)
        immediateInvoke = true
      }, delay)
    }
  }
}

const throttle = (callback: Function, delay: number = 500) => {
  let flag: boolean = false
  let timeout: ReturnType<typeof setTimeout>
  return (args?: any[]) => {
    if (!flag) {
      args ? callback(...args) : callback()
      flag = true
      timeout = setTimeout(() => {
        flag = false
        clearTimeout(timeout)
      }, delay)
    } else return
  }
}

const formatFileSize = (bytes: number) => {
  if (!bytes) return ''
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getIsMobile = () => {
  return window.matchMedia('(any-pointer:coarse)').matches || window.matchMedia('max-width: 768px').matches
}

const getHtmlFromMd = (text: string) => {
  const marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang, info) {
        console.log(code, lang, info)

        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
      },
    })
  )
  console.log(marked.parse(text))
  return marked.parse(text)
}

const utils = {
  formatProblemJson,
  getPathArray,
  getQuerys,
  generateTOC,
  getSideBarType,
  getDuration,
  copyToClipboard: copy,
  getTimeAgo,
  debounce,
  throttle,
  formatFileSize,
  getIsMobile,
  getHtmlFromMd,
}

export default utils
