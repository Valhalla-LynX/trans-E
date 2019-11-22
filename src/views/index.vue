<template>
  <div>
    <van-cell-group ref="container" style="height: 100%;">
      <van-sticky :container="container" >
        <van-nav-bar title="ᐛ Multilingual翻天下" /><!-- 导航栏 -->

        <van-cell ><!-- 文本框 -->
          <van-field ref="input1" @focus.native.capture="textareaH=10" @keydown.enter="preventBreak" @keyup.enter="trans"
            v-model="form.content" :rows="textareaH" type="textarea" clearable placeholder="输入文字" style="background-color: #F8F8F8; border-radius: 18px;"/>
          <van-row type="flex" justify="space-between">
            <van-col span="23" >
              <nobr>
              <van-button disabled size="small" type="default" :text="form.sourceLanguageName" round></van-button>
              <van-button disabled color="#F8F8F8" icon="https://img.icons8.com/ios/50/000000/chevron-right.png"></van-button>
              <van-button disabled size="small" type="default" round class="van-ellipsis" :text="langBtn" style="max-width: 160px; overflow: hidden; text-overflow: ellipsis;"></van-button>
              </nobr>
            </van-col>
            <van-col span="3">
              <van-button color="#FFFFFF" @click="trans" icon="https://img.icons8.com/ios/144/000000/search--v1.png"></van-button>
            </van-col>
          </van-row>
        </van-cell>
      </van-sticky>

      <van-cell-group>
        <!-- 翻译结果 -->
        <van-cell :key="item.name" v-for="(item, index) in form.language" style="background-color: #eeeeee;">
          <van-cell clickable v-clipboard:copy="result[index]" @click="toNotify"
            size="large" :key="item.value" :title="form.language[index]" :label="result[index]" :style="resultBackground(index)">
            <van-icon slot="right-icon" size="2em" name="ellipsis" color="LightSalmon" @click.stop="showPopup(index)" style="line-height: inherit;" />
          </van-cell>
        </van-cell>
        <van-cell style="height:40em; background-color: #eeeeee;" />
      </van-cell-group>
    </van-cell-group>

    <van-tabbar safe-area-inset-bottom>
      <!-- 底部导航1 -->
      <van-tabbar-item>
        <van-dropdown-menu direction="up" >
          <!-- 上拉菜单 -->
          <van-dropdown-item title="源语言">
            <!-- 上拉菜单选项 -->
            <van-radio-group v-model="form.sourceLanguage">
              <!-- 单选框 -->
              <van-cell-group>
                <van-cell size="large" v-for="(item) in langIn" clickable :key="item.value" @click="form.sourceLanguageName=item.name;">
                  <van-radio :name="item.value" ref="checkboxes">{{item.name}} - {{item.value}}</van-radio>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </van-dropdown-item>
        </van-dropdown-menu>
      </van-tabbar-item>
      <!-- 底部导航2 -->
      <van-tabbar-item>
        <van-dropdown-menu direction="up">
          <!-- 上拉菜单 -->
          <van-dropdown-item title="目标语言" ref="item">
            <!-- 上拉菜单选项 -->
            <van-checkbox-group v-model="form.language">
              <!-- 复选框 -->
              <van-cell-group>
                <van-cell clickable v-for="(item, index) in langOut" :key="item.value" :title="item.name" :value="item.value + ' - '"
                  @click="toggle(index)">
                  <van-checkbox :name="item.value" ref="checkboxes" slot="right-icon"></van-checkbox>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </van-dropdown-item>
        </van-dropdown-menu>
      </van-tabbar-item>
    </van-tabbar>

    <!-- 翻译检查面板 -->
    <van-popup v-model="isPopupShow" round closeable :style="{ height: '50%', width: '80%' }">
      <van-nav-bar title="语义检查" />
      <van-cell :border="false" size="large" :title="form.PopupContent" />
      <van-tabbar active-color="#7d7e80">
        <van-tabbar-item icon="description" @click="jumpOut('https://www.baidu.com/s?wd='+ form.PopupContent)">百度</van-tabbar-item>
        <van-tabbar-item icon="orders-o" @click="jumpOut('https://www.google.com/search?q='+ form.PopupContent)">谷歌</van-tabbar-item>
        <van-tabbar-item icon="photo-o" @click="jumpOut('https://www.google.com/search?tbm=isch&q='+ form.PopupContent)">谷歌图片</van-tabbar-item>
        <van-tabbar-item icon="browsing-history-o" @click="jumpOut('https://en.wikipedia.org/wiki/'+ form.PopupContent)">维基百科</van-tabbar-item>
      </van-tabbar>
    </van-popup>

  </div>
</template>

<script>
import VueClipboard from 'vue-clipboard2'
import request from '../component/request'
import {
  langIn,
  langOut
} from '../config/config'
import Vue from 'vue'
import {
  Icon,
  Cell,
  CellGroup,
  NavBar,
  Button,
  Field,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Tabbar,
  TabbarItem,
  DropdownMenu,
  DropdownItem,
  Popup,
  Notify,
  Row,
  Col,
  Sticky
} from 'vant'
Vue.use(Icon)
Vue.use(Cell).use(CellGroup)
Vue.use(NavBar)
Vue.use(Field)
Vue.use(Button)
Vue.use(Checkbox).use(CheckboxGroup)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Tabbar).use(TabbarItem)
Vue.use(DropdownMenu).use(DropdownItem)
Vue.use(Popup)
Vue.use(Notify)
Vue.use(VueClipboard)
Vue.use(Row).use(Col)
Vue.use(Sticky)

export default {
  name: 'index',
  data () {
    return {
      isPopupShow: false, // 是否展示翻译检查面板
      textareaH: 8, // 输入框高度
      langIn, // 源语言库
      langOut, // 目标语言库
      form: {
        sourceLanguage: 'auto', // 源语言代码
        sourceLanguageName: '自动检测', // 源语言名称
        language: null, // 目标语言代码
        languageName: ' ', // 目标语言名称
        content: null,
        PopupContent: null,
        backgroundStyle: 'background-color: #F8F8F8;'
      },
      result: null,
      container: null
    }
  },
  computed: {
    langBtn () {
      return (this.form.language.length > 0) ? this.form.language.join('. ') : '目标语言'
    }
  },
  mounted () {
    this.container = this.$refs.container
  },
  methods: {
    async trans () {
      this.$refs.input1.blur()
      this.$notify({
        message: '开始翻译',
        background: 'CornflowerBlue',
        duration: 1500
      })
      this.textareaH = 2
      if (this.form.content) {
        this.result = []
        for (let lg of this.form.language) {
          await request.get('/trans', {
            query: this.form.content,
            to: lg
          })
            .then((res) => {
              console.log(res)
              this.result.push(res.data.trans_result[0].dst)
              console.log(this.result)
            })
            .catch((response) => {
              console.log(response)
            })
        }
      }
    },
    // 多选框点击单元格选中
    toggle (index) {
      this.$refs.checkboxes[index].toggle()
    },
    // 翻译检查弹窗
    showPopup (i) {
      this.isPopupShow = true
      this.form.PopupContent = this.result[i]
    },
    toNotify () {
      this.$notify({
        message: '成功复制到剪贴板',
        background: 'YellowGreen',
        duration: 1000
      })
    },
    preventBreak (e) {
      e.preventDefault() // 阻止浏览器默认换行操作
    },
    jumpOut (e) {
      window.open(e)
    },
    resultBackground (i) {
      return (i % 2 === 0) ? 'background-color: #FFFFFF; border-radius: 10px;' : 'background-color: #FFFFFF; border-radius: 10px;'
    }
  },
  created () {
    this.form.languageName = []
    this.form.language = []
    this.form.content = ''
    this.result = []
    this.form.PopupContent = ''
  }
}
</script>

<style scoped>
</style>
