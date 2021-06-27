// 7节
const axios = require('axios')
// 获取签名方法
const getSecuritySign = require('./sign')

const ERR_OK = 0
const token = 5381

// 公共参数
const commonParams = {
  g_tk: token,
  loginUin: 0,
  hostUin: 0,
  inCharset: 'utf8',
  outChartset: 'utf8',
  notice: 0,
  needNewCode: 0,
  format: 'json',
  platform: 'ypp.json'
}

// 获取随机数值
function getRandomVal(prefix = '') {
  return prefix + (Math.random() + '').replace('0.', '')
}

// 对axios get请求的封装
// 修改请求的headers值，合并公共请求参数
function get(url, params) {
  return axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com/'
    },
    params: Object.assign({}, commonParams, params)
  })
}

// 注册后端路由
function registerRouter(app) {
  registerRecommend(app)
}

// 注册推荐列表路由接口
function registerRecommend(app) {
  app.get('/api/getRecommend', (req, res) => {
    // 第三方接口 url
    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

    // 构造请求data 参数
    const data = JSON.stringify({
      comm: { ct: 24 },
      recomPlaylist: {
        method: 'get_hot_recommend',
        param: { async: 1, cmd: 2},
        module: 'playlist.HotRecommendServer'
      },
      focus: { module: 'music.musicHall.MusicHallPlatform', method: 'GetFocus', param: {} }
    })

    // 随机数值
    const randomVal = getRandomVal('recom')
    // 计算签名值
    const sign = getSecuritySign(data)
    
    // 发送get 请求
    get(url, {
      sign,
      '-': randomVal,
      data
    }).then(res => {
      const data = res.data
      if (data.code === ERR_OK) {
        // 处理轮播图数据
        const focusList = data.focus.data.shelf.v_niche[0].v_card
        const sliders = []
        const jumpPrefixMap = {
          10002: 'https://y.qq.com/n/yqq/album/',
          10014: 'https://y.qq.com/n/yqq/playlist/',
          10012: 'https://y.qq.com/n/yqq/mv/v/',
        }
        // 最多获取10条数据
        const len = Math.min(focusList.length, 10)
        for (let i = 0; i < len; i++) {
          const item = focusList[i]
          const sliderItem = {}
          // 单个轮播图数据包括 id pic link等字段
          sliderItem.id = item.id
          sliderItem.pic = item.cover
          if (jumpPrefixMap[item.jumptype]) {
            sliderItem.link = jumpPrefixMap[item.jumptype] + (item.subid || item.id) + '.html'
          } else if (item.jumptype === 3001) {
            sliderItem.link = item.id
          }

          sliders.push(sliderItem)
        }
        // 处理推荐歌单数据
        const albumList = data.recomPlaylist.data.v_hot
        const albums = []
        for (let i = 0; i < albumList.length; i++) {
          const item = albumList[i]
          const albumItem = {}
          // 推荐歌单数据包括  id  username  title   pic等字段
          albumItem.id = item.content_id
          albumItem.username = item.username
          albumItem.title = item.title
          albumItem.pic = item.cover

          albums.push(albumItem)
        }
        
        // 往前端发送一个标准格式的相应数据，包括成功和错误码和数据
        res.json({
          code: ERR_OK,
          result: {
            sliders,
            albums
          }
        })
      } else {
        res.json(data)
      }
    })
  })
}

module.exports = registerRouter