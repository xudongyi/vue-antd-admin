<template>
  <a-config-provider :locale="locale">
    <keep-alive include="日志查询">
      <router-view></router-view>
    </keep-alive>
  </a-config-provider>
</template>

<script>
import enquireScreen from './utils/device'
import {mapState} from 'vuex'
import themeUtil from '@/utils/themeUtil';

export default {
  name: 'App',
  data() {
    return {
      locale: {}
    }
  },
  created () {
    let _this = this
    this.setLanguage(this.lang)
    enquireScreen(isMobile => {
      _this.$store.commit('setting/setDevice', isMobile)
    })
  },
  mounted() {
   this.setWeekModeTheme(this.weekMode)
    if(this.isMobile()) {
      console.log("移动端")
    }else {
      console.log("PC端")
    }
  },
  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val)
    },
    lang(val) {
      this.setLanguage(val)
    },
    'theme.mode': function(val) {
      let closeMessage = this.$message.loading(`您选择了主题模式 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(this.theme.color, val).then(() => {
        setTimeout(closeMessage, 1000)
      })
    },
    'theme.color': function(val) {
      let closeMessage = this.$message.loading(`您选择了主题色 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(val, this.theme.mode).then(() => {
        setTimeout(closeMessage, 1000)
      })
    }
  },
  computed: {
    ...mapState('setting', ['theme', 'weekMode', 'lang'])
  },
  methods: {
    // 添加判断方法
    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      return flag;
    },
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add('week-mode')
      } else {
        document.body.classList.remove('week-mode')
      }
    },
    setLanguage(lang) {
      this.$i18n.locale = lang
      switch (lang) {
        case 'CN':
          this.locale = require('ant-design-vue/es/locale-provider/zh_CN').default
          break
        case 'HK':
          this.locale = require('ant-design-vue/es/locale-provider/zh_TW').default
          break
        case 'US':
        default:
          this.locale = require('ant-design-vue/es/locale-provider/en_US').default
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
  #id{
  }
</style>
