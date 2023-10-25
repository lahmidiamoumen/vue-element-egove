<template>
  <div class="app-container">
    <div v-if="user" class="dashboard-editor-container">
      <el-row :gutter="20">
        <el-col :span="3" :xs="24">
          <span style="padding: 5px" />
        </el-col>
        <el-col :span="5" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="13" :xs="24">
          <el-card>
            <activity :feed="feed" @paginationGanged="sortChanged($event)" />
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import { fetchListAll } from '@/api/article'

export default {
  name: 'Profile',
  components: { UserCard, Activity },
  data() {
    return {
      importanceOptions: [],
      calendarTypeOptions: [],
      sortOptions: [],
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
      },
      feed: {
        list: [],
        total: 0,
        listLoading: true
      },
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.listQuery.id = this.$route.params && this.$route.params.id
    // this.fetchEssai(id)

    this.getUser()
    this.getListAll()
  },
  methods: {
    sortChanged(sortObject) {
      this.listQuery = Object.assign(this.listQuery, sortObject)
      this.getListAll()
    },
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    },
    handleFilter() {
    },
    getListAll() {
      this.feed.listLoading = true
      fetchListAll(this.listQuery).then(response => {
        this.feed.list = response.rows
        this.feed.total = Number.isNaN(parseInt(response.count)) ? 0 : parseInt(response.count)
        this.feed.listLoading = false
      })
    }
  }
}
</script>
<style >
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}
</style>
