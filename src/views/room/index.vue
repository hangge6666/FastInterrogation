<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
// 导入socket.io插件
import { io, type Socket } from 'socket.io-client'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { onUnmounted } from 'vue'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType, OrderType } from '@/enums'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/api/consult'
import { nextTick } from 'vue'
import { provide } from 'vue'
const baseURL = 'https://consult-api.itheima.net'
/**
 * 初始化创建 ws长连接
 * 1.通过io函数 传入后台ws连接的地址和相关的参数(token,orderId)
 * 2.连接建立成功后的相关事件
 *  1.通过io实例的connect事件，监听连接是否成功
 *  2.通过io实例的error事件，监听连接的错误
 *  3.通过io实例的disconnection，监听连接断开
 */
// 存储socket实例
let socket: Socket
// 聊天列表
const list = ref<Message[]>([])
const store = useUserStore()
const route = useRoute()
const initSocket = () => {
  // 1.建立连接
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })
  socket.on('connect', () => {
    console.log('连接成功')
  })
  socket.on('error', () => {
    console.log('连接出错')
  })
  socket.on('disconnect', () => {
    console.log('断开链接')
  })
  // 1.接收ws服务器给浏览器发送的
  // 说明： {data}:{data添加类型}
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    console.log('建立连接后，返回的默认数据', data)
    const result: Message[] = []
    data.forEach((element) => {
      // 1.发送消息的时间 放入result
      result.push({
        id: element.createTime,
        msgType: MsgType.Notify,
        createTime: element.createTime,
        msg: {
          content: element.createTime
        }
      })
      // 2.把items的消息放入result中
      result.push(...element.items)
      // 把处理好的列表追加到list中
      list.value.push(...result)
      console.log(list.value)
    })
  })
  // 2. 接收医生的消息
  socket.on('receiveChatMsg', async (msg) => {
    list.value.push(msg)
    // 每次收到消息后滚动到最底部
    // 等到异步更新之后在执行滚动
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
  })

  // 3.接收订单变化消息
  socket.on('statusChange', async () => {
    getOrederDetail()
    console.log('订单更新了')
  })
}

onMounted(() => {
  initSocket()
})

onUnmounted(() => {
  socket.close()
})
//2.发送文字消息
const consult = ref<ConsultOrderItem>()
const getOrederDetail = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
}
onMounted(() => {
  getOrederDetail()
})
const sendText = (text: string) => {
  console.log(text)

  // console.log(text)
  // 和后台约定的时间名 和对象
  socket.emit('sendChatMsg', {
    from: store.user.id, // 发送人的id
    to: consult.value?.docInfo?.id, //接收消息的人
    msgTyep: MsgType.MsgText, // 消息的类型
    msg: {
      content: text
    }
  })
}

// 4.发送图片消息
const sendImg = (img: Image) => {
  // console.log(text)
  // 和后台约定的时间名 和对象
  socket.emit('sendChatMsg', {
    from: store.user.id, // 发送人的id
    to: consult.value?.docInfo?.id, //接收消息的人
    msgTyep: MsgType.MsgImage, // 消息的类型
    msg: {
      picture: img
    }
  })
}
// 评价成功修改状态
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    item.msg.evaluateDoc = { score }
    item.msgType = MsgType.CardEva
  }
}
provide('consult', consult)
provide('completeEva', completeEva)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <!-- 1. 问诊状态-->
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <!-- 2. 问诊聊天列表消息 -->
    <room-message :list="list" />
    <!-- 3. 底部操作栏：发消息 -->
    <room-action
      :disabled="consult?.status !== OrderType.ConsultChat"
      @send-text="sendText"
      @send-img="sendImg"
    />
  </div>
</template>
<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
