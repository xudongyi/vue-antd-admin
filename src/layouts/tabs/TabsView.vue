<template>
  <admin-layout>
    <contextmenu :itemList="menuItemList" :visible.sync="menuVisible" @select="onMenuSelect" />
    <a-tabs
      v-if="multiPage"
      type="editable-card"
      :active-key="activePage"
      :style="`margin: -16px auto 8px; ${layout == 'head' ? 'max-width: 1400px;' : ''}`"
      :hide-add="true"
      @change="changePage"
      @edit="editPage"
      @contextmenu="onContextmenu"
    >
      <a-tab-pane :closable="page.name!='首页'" :key="page.fullPath" v-for="page in pageList">
        <span slot="tab" :pagekey="page.fullPath">{{page.name}}</span>
      </a-tab-pane>
    </a-tabs>
    <div class="tabs-view-content" :style="`margin-top: ${multiPage ? -24 : 0}px`">
      <page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
          <router-view v-on:viewIn="remove"/>
      </page-toggle-transition>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '@/layouts/AdminLayout'
import Contextmenu from '@/components/menu/Contextmenu'
import PageToggleTransition from '@/components/transition/PageToggleTransition'
import {mapState, mapMutations} from 'vuex'
import {getI18nKey} from '@/utils/routerUtil'

export default {
  name: 'TabsView',
  i18n: require('./i18n'),
  components: { PageToggleTransition, Contextmenu, AdminLayout },
  data () {
    return {
      pageList: [],
      activePage: '',
      menuVisible: false
    }
  },
  computed: {
    ...mapState('setting', ['multiPage', 'animate', 'layout', 'dustbins']),
    menuItemList() {
      return [
        { key: '1', icon: 'vertical-right', text: this.$t('closeLeft') },
        { key: '2', icon: 'vertical-left', text: this.$t('closeRight') },
        { key: '3', icon: 'close', text: this.$t('closeOthers') }
      ]
    },
    tabsOffset() {
      return this.multiPage ? 24 : 0
    }
  },
  created () {
    const route = this.$route
    this.pageList.push(route)
    this.activePage = route.fullPath

  },
  mounted () {
    this.beforeUnload();
    this.correctPageMinHeight(-this.tabsOffset)
  },
  beforeDestroy() {
    this.correctPageMinHeight(this.tabsOffset)
  },
  watch: {
    '$route': function (newRoute) {
      this.activePage = newRoute.fullPath
      this.putCache(newRoute)
      if (!this.multiPage) {
        this.pageList = [newRoute]
      } else if (this.pageList.findIndex(item => item.fullPath == newRoute.fullPath) == -1) {
        this.pageList.push(newRoute)
      }
    },
    'multiPage': function (newVal) {
      if (!newVal) {
        this.pageList = [this.$route]
      }
    },
    tabsOffset(newVal, oldVal) {
      this.correctPageMinHeight(oldVal - newVal)
    },
    'pageList':function (val) {
      let s = []
      val.forEach(function(ele, i){
        let obj  = {};
        obj.fullPath = ele.fullPath;
        obj.name = ele.name;
        s.push(obj);
      });
      localStorage.setItem(process.env.VUE_APP_TABS, JSON.stringify(s))
    }
  },
  methods: {
    beforeUnload() {
      let oldViews = JSON.parse(localStorage.getItem(process.env.VUE_APP_TABS)) || [];
      if (oldViews.length > 0) {
        this.pageList = oldViews;
      }
    },
    changePage (key) {
      this.activePage = key
      this.$router.push(key)
    },
    editPage (key, action) {
      this[action](key) // remove
    },
    remove (key) {
      if (this.pageList.length === 1) {
        return this.$message.warning(this.$t('warn'))
      }
      let index = this.pageList.findIndex(item => item.fullPath === key)
      let pageRoute = this.pageList[index]
      this.clearCache(pageRoute)
      this.pageList = this.pageList.filter(item => item.fullPath !== key)
      if (key === this.activePage) {
        index = index >= this.pageList.length ? this.pageList.length - 1 : index
        this.activePage = this.pageList[index].fullPath
        this.$router.push(this.activePage)
      }
    },
    onContextmenu (e) {
      const pageKey = getPageKey(e.target)
      if (pageKey) {
        e.preventDefault()
        this.menuVisible = true
      }
    },
    onMenuSelect (key, target) {
      let pageKey = getPageKey(target)
      switch (key) {
        case '1': this.closeLeft(pageKey); break
        case '2': this.closeRight(pageKey); break
        case '3': this.closeOthers(pageKey); break
        default: break
      }
    },
    closeOthers (pageKey) {
      const index = this.pageList.findIndex(item => item.fullPath === pageKey)
      // 要关闭的页面清除缓存
      let home =  this.pageList.slice(0,index==0?0:1)
      this.pageList.forEach(item => {
        if (item.fullPath !== pageKey){
          this.clearCache(item)
        }
      })
      this.pageList = home.concat(this.pageList.slice(index, index + 1))
      this.activePage = this.pageList[0].fullPath
      this.$router.push(this.activePage)
    },
    closeLeft (pageKey) {
      const index = this.pageList.findIndex(item => item.fullPath === pageKey)
      let home =  this.pageList.slice(0,index==0?0:1)
      // 清除缓存
      this.pageList.forEach((item, i) => {
        if (i < index) {
          this.clearCache(item)
        }
      })
      this.pageList =  home.concat(this.pageList.slice(index))
      if (this.pageList.findIndex(item => item.fullPath === this.activePage) === -1) {
        this.activePage = this.pageList[0].fullPath
        this.$router.push(this.activePage)
      }
    },
    closeRight (pageKey) {
      const index = this.pageList.findIndex(item => item.fullPath === pageKey)
      // 清除缓存
      this.pageList.forEach((item, i) => {
        if (i > index) {
          this.clearCache(item)
        }
      })
      this.pageList = this.pageList.slice(0, index + 1)
      if (this.pageList.findIndex(item => item.fullPath === this.activePage) === -1) {
        this.activePage = this.pageList[this.pageList.length - 1].fullPath
        this.$router.push(this.activePage)
      }
    },
    clearCache(route) {
      let name = []
      name.push(route.name)
      this.setDustbins(this.dustbins.concat(name))
    },
    putCache(route) {
      let name = []
      name.push(route.name)
      if (route.name!='薪资查询'&& !this.dustbins.includes(name)) {
        this.setDustbins(this.dustbins.filter(item => item !== name))
      }
    },
    ...mapMutations('setting', ['setDustbins', 'correctPageMinHeight'])
  }
}
/**
 * 由于ant-design-vue组件库的TabPane组件暂不支持自定义监听器，无法直接获取到右键target所在标签页的 pagekey 。故增加此方法用于
 * 查询右键target所在标签页的标识 pagekey ，以用于自定义右键菜单的事件处理。
 * 注：TabPane组件支持自定义监听器后可去除该方法并重构 ‘自定义右键菜单的事件处理’
 * @param target 查询开始目标
 * @param depth 查询层级深度 （查找层级最多不超过3层，超过3层深度直接返回 null）
 * @returns {String}
 */
function getPageKey (target, depth = 0) {
  if (depth > 2 || !target) {
    return null
  }
  return target.getAttribute('pagekey') || getPageKey(target.firstElementChild, ++depth)
}
</script>

<style scoped lang="less">
  .tabs-view-content{
    position: relative;
  }
</style>
