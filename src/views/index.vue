<template>
  <div>
    <van-nav-bar
      title="trans-E"></van-nav-bar>
    <van-cell-group>
      <van-cell>
        <van-field v-model="form.content" placeholder="请输内容" />
      </van-cell>
      <van-cell>
        <van-checkbox-group v-model="form.language">
          <van-checkbox
            v-for="(item) in lang"
            :key="item.value"
            :name="item.value"
          >{{item.name}}{{item.value}}</van-checkbox>
        </van-checkbox-group>
      </van-cell>
      <van-cell>
        <van-button type="info" @click="trans">翻译</van-button>
      </van-cell>
      <van-cell-group>
        <van-cell v-for="(item, index) in form.language" :key="item.value">
          {{item}}: {{result?result[index]:'-'}}
        </van-cell>
      </van-cell-group>
    </van-cell-group>
  </div>
</template>

<script>
import request from '../component/request'
import {lang} from '../config/config'
import Vue from 'vue'
import { Cell, CellGroup, NavBar, Button, Field, Checkbox, CheckboxGroup } from 'vant'
Vue.use(Cell).use(CellGroup)
Vue.use(NavBar)
Vue.use(Field)
Vue.use(Button)
Vue.use(Checkbox).use(CheckboxGroup)

export default {
  name: 'index',
  data () {
    return {
      lang: lang,
      form: {
        language: null,
        content: null
      },
      result: null
    }
  },
  methods: {
    async trans () {
      if (this.form.content) {
        this.result = []
        for (let lg of this.form.language) {
          await request.get('/trans', {query: this.form.content, to: lg})
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
    }
  },
  created () {
    this.form.language = []
    this.form.content = ''
    this.result = []
  }
}
</script>

<style scoped>

</style>
