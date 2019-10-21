<template>
  <div>
    <van-nav-bar title="trans-E" ></van-nav-bar> <!-- 顶部导航 -->
    <van-cell style="background-color: #F8F8F8;">  <!-- 顶部信息栏 -->
      {{form.sourceLanguageName}} » {{ form.language.join(' ') }}
       <van-icon
          slot="right-icon"
          name="exchange"
          @click="trans"
          style="line-height: inherit;"
        />
    </van-cell>

    <van-cell-group>
      <van-cell>
      <!-- 文本框 -->
      <van-field @focus.native.capture="textareaH=10" @keyup.enter="trans" v-model="form.content" :rows="textareaH" type="textarea" clearable placeholder="输入文字" />
      </van-cell>

      <van-cell-group style="line-height: inherit;" >
        <!-- 翻译结果 -->
        <van-cell clickable v-clipboard:copy="result[index]" @click="toNotify" v-for="(item, index) in form.language" size="large" :key="item.value" :title="form.language[index]" :label="result[index]">
          <van-icon slot="right-icon" name="replay" @click.stop="showPopup" style="line-height: inherit;" />
        </van-cell>
      </van-cell-group>
    </van-cell-group>

    <van-tabbar safe-area-inset-bottom>
      <!-- 底部导航1 -->
      <van-tabbar-item>
        <van-dropdown-menu direction="up">
          <!-- 上拉菜单 -->
          <van-dropdown-item title="源语言" >
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
                <van-cell clickable v-for="(item, index) in langOut" :key="item.value" :title="item.name" :value="item.value + ' - '" @click="toggle(index)">
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
      <van-cell :border="true" size="large" title="语义检查" />
      <van-cell :border="false" size="large" title="内容" />
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
  Notify
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
        sourceLanguageName: '自动检测语言', // 源语言名称
        language: null, // 目标语言代码
        languageName: ' ', // 目标语言名称
        content: null
      },
      result: null
    }
  },
  methods: {
    async trans () {
      this.$notify({ message: '开始翻译', background: 'CornflowerBlue', duration: 1500 })
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
    showPopup () {
      this.isPopupShow = true
    },
    toNotify () {
      this.$notify({
        message: '成功复制到剪贴板',
        background: 'YellowGreen',
        duration: 1000
      })
    }
  },
  created () {
    this.form.languageName = []
    this.form.language = []
    this.form.content = ''
    this.result = []
  }
}
</script>

<style scoped>

</style>
