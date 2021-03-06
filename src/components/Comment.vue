<template>
  <div>
    <div id="btn-submit-comment" v-if="!profile">
      <input
        type="text"
        trim
        :disabled="!isLogin"
        class="text-input make-comments-input"
        placeholder="Add a public comment... stroke ↵ to send"
        v-model="newCommentInput"
        @keyup.enter="submitComment"
      />
      <b-tooltip v-if="!isLogin" target="btn-submit-comment" placement="top">
        <strong>please login first</strong>
      </b-tooltip>
    </div>
    <!-- Display board -->
    <div v-if="isBusy" class="text-center">
      <b-spinner variant="dark" class="my-5"></b-spinner>
    </div>
    <template v-else>
      <div v-if="!comments.length" class="text-center my-5">
        <b>no comment yet</b>
      </div>
      <div v-for="(item, index) in comments" class="comment-entry" :key="index">
        <b-dropdown dropleft lazy  no-caret v-if="isCommenter(item)" variant="link" class="comment-entry-dropdown" toggle-class="text-decoration-none">
          <template v-slot:button-content>
            <b-icon-three-dots-vertical class="comment-entry-ellipsis-icon" />
          </template>
          <b-dropdown-item @click="editComment(item)">Edit</b-dropdown-item>
          <b-dropdown-item @click="deleteComment(item._id)">Delete</b-dropdown-item>
        </b-dropdown>
        <p>
          <template v-if="profile">
            <b>#{{index + 1}} Commented</b>
            <span> on </span>
            <b-link :to="'/subject/' + item.book._id">{{item.book.title}} </b-link>
          </template>
          <template v-else>
            <b>#{{index + 1}} </b>
            <b-link :to="'/user/' + item.user.name">{{item.user.name}} </b-link>
          </template>
          <span class="text-secondary" v-b-tooltip.hover v-b-tooltip.top :title="timeConverter(item.date)">
            <timeago :datetime="item.date" :auto-update="60" />
            {{commentEdited(item.edited)}}
          </span>
        </p>
        <div>
          <p v-if="editting._id !== item._id">{{item.content}}</p>
          <!-- edit component -->
          <template v-else>
            <input type="text" v-model="editInput" class="text-input" placeholder="Edit the comment..." />
            <b-button size="sm" class="text-input-button" squared variant="outline-secondary" @click="cancelEdit">CANCEL</b-button>
            <b-button size="sm" class="text-input-button" squared variant="primary" :disabled="!savable" @click="submitEdit">SAVE</b-button>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { timeConverter, objectIsEmpty, setClock } from '@/utils.js'
export default {
  name: 'Comment',
  async created () {
    const vm = this
    await vm.fetchComments()
  },
  data () {
    return {
      newCommentInput: '',
      editInput: '',
      isBusy: true,
      originalContent: '',
      editting: {},
      comments: []
    }
  },
  methods: {
    async fetchComments () {
      const vm = this
      vm.isBusy = true
      await setClock()
      let url = ''
      if (vm.profile) {
        url = `/comment?user=${vm.id}`
      } else {
        url = `/comment?book=${vm.id}`
      }
      vm.axios.get(url)
        .then(({ data }) => {
          vm.$log.info('data', data)
          vm.comments = data.comments
          vm.isBusy = false
        })
        .catch(err => {
          vm.$log.info('fail to get comments', err)
        })
    },
    timeConverter: timeConverter,
    async submitComment () {
      const vm = this
      if (!vm.newCommentInput) {
        vm.$fm.info('Please enter content')
        return
      }
      try {
        const { data:res } = await vm.axios({
          method: 'POST',
          url: '/comment',
          data: {
            id: vm.id,
            content: vm.newCommentInput
          }
        })
        if (res.code === 1) {
          vm.newCommentInput = null
          vm.fetchComments()
          vm.$fm.success('Comment successfully')
        } else {
          vm.$fm.error('Fail to comment:' + res.msg)
        }
      } catch (error) {
        vm.$log.error(error)
        vm.$fm.NETERR()
      }
    },
    editComment(item) {
      const vm = this
      vm.editting = item
      vm.editInput = item.content
      vm.originalContent = item.content
    },
    cancelEdit() {
      this.editting = {}
    },
    submitEdit() {
      const vm = this
      vm.axios({
        method: 'PUT',
        url: `/comment/${vm.editting._id}`,
        data: {
          content: vm.editInput
        }
      }).then(({ data: res }) => {
        vm.$log.info(res)
        if (res.code === 1) {
          vm.$fm.success(res.msg)
          vm.editting.content = vm.editInput
          vm.cancelEdit()
        } else {
          vm.$fm.error(res.msg)
        }
      }).catch(err => {
        vm.$log.error('err', err)
      })
    },
    deleteComment(id) {
      const vm = this
      vm.axios({
        method: 'DELETE',
        url: `/comment/${id}`,
      }).then(({ data: res }) => {
        vm.$log.info(res)
        if (res.code === 1) {
          vm.$fm.warning(res.msg)
          vm.fetchComments()
        } else {
          vm.$fm.error(res.msg)
        }
      }).catch(err => {
        vm.$log.error('err', err)
      })
    },
    commentEdited(e) {
      if (e) {
        return '(edited)'
      } else {
        return ''
      }
    },
    isCommenter (comment) {
      const vm = this
      // is profile page
      if (vm.profile) {
        return vm.$route.params.name === vm.userName
      } else {
        return comment.user.name === vm.userName
      }
    }
  },
  computed: {
    isLogin () {
      return Boolean(this.$store.state.userName)
    },
    savable () {
      const vm = this
      return vm.editInput !== vm.originalContent && vm.editInput.length !== 0
    },
    userName () {
      return this.$store.state.userName
    },
  },
  props: {
    id: String,
    profile: Boolean
  },
  components: {
    BIconThreeDotsVertical: () => import('bootstrap-vue').then(m => m.BIconThreeDotsVertical),
  }
}
</script>
<style lang="scss">
.comment-entry {
  margin: 1rem 0;
  position: relative;
}

.comment-entry:hover {
  .comment-entry-ellipsis-icon {
    opacity: 1;
  }
}

.comment-entry-dropdown {
  position: absolute;
  left: 80%;
  top: 8%;
}

.comment-entry-ellipsis-icon {
  color: silver;
  opacity: 0;
  transition: opacity 0.2s ease-in;
}

.comment-entry-ellipsis-icon:hover {
  color: rgb(78, 78, 78);
}

.text-input {
  outline: 0;
  border-width: 0 0 2px;
  border-color: silver;  
}
.text-input:focus {
  border-color: rgb(78, 78, 78);
}
.text-input-button {
  border: none;
}
.make-comments-input {
  width: 100%;
}
</style>
