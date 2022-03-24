<template>
  <div class="app-container dashboard">
    <div v-if="user">
      <splitpanes split="vertical" style="padding: 0px 10%">
        <pane size="18" class="toolL" style="top: 50px;position: fixed;">
          <user-card :user="user" @sortChanged="sortChanged($event)" />
        </pane>
        <pane size="64" style="left: 22.5%;position: relative;max-width: 56%">
          <splitpanes horizontal>
            <pane>
              <div style="height: 300px; background-color: #373e4c;text-align: center;">
                <span>Heloo</span>
              </div>
            </pane>
            <pane>
              <el-tabs v-model="activeTab">
                <el-tab-pane label="Recent" name="activity">
                  <activity :feed="feed" :isHome="true" @paginationGanged="sortChanged($event)" />
                </el-tab-pane>
                <el-tab-pane label="Unvoted" name="unvoted">
                  <activity :feed="feed" :isHome="true" :unvoted="true" @paginationGanged="sortChanged($event)" />
                </el-tab-pane>
                <el-tab-pane label="Voted" name="voted">
                  <activity :feed="feed" :isHome="true" :voted="true" @paginationGanged="sortChanged($event)" />
                </el-tab-pane>
                <el-tab-pane label="Following" name="following">
                  <activity :feed="feed" :isHome="true" :following="true" @paginationGanged="sortChanged($event)" />
                </el-tab-pane>
              </el-tabs>

            </pane>
            <el-button type="primary" icon="el-icon-search">Search</el-button>
          </splitpanes>
        </pane>
        <pane size="18" style="top: 50px;position: fixed;left: 72%;">
          <user-profile :user="user" />
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import UserCard from '../profile/components/UserCard'
import UserProfile from '../profile/components/UserProfile'
import { mapGetters } from 'vuex'
import Activity from '../profile/components/Activity'
import Timeline from '../profile/components/Timeline'
import { fetchListAll } from '@/api/article'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, UserProfile, Splitpanes, Pane },
  
  data() {
    return {
      importanceOptions: [],
      calendarTypeOptions: [],
      sortOptions: [],
      listQuery: {
        page: 1,
        limit: 20
      },
      feed: {
        list: [],
        total: 0,
        listLoading: true
      },
      center: 'center',
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
    this.getUser();
    this.getListAll()
  },
  methods: {
    sortChanged(sortObject) {
      this.listQuery = Object.assign(this.listQuery, sortObject);
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

<style>

/* .splitpanes__pane {
  overflow: scroll;
} */
.el-tag.el-tag--info {
    background-color: #ffffff;
    padding: 0px 9px;
    border-color: #e9e9eb;
    color: #5b5c5f;
}
.el-form-item__content .el-input__inner, .el-collapse-item__content .el-input__inner{
  background-color: #f6f7f8 !important;
  color: #000000;
}
.el-textarea__inner{
  background-color: #f6f7f8;
  border: unset;
  color: #000000;
}
.el-textarea__inner::placeholder {
  color: #7c7e81;
}
.el-input__inner::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
  color: #65676B;
}
.el-input__inner::-moz-placeholder, textarea::-moz-placeholder {
  color: #65676B;
}
.el-input__inner::placeholder {
  /* modern browser */
  color: #7f8183;
}
.el-card {
  color: black;
}
.el-tabs__header {
  background-color: white;
  padding: 0px 30px;
  padding-top: 25px;
}
::placeholder {
  color: #686868;
}
.el-input__inner {
    background-color: #e7eaef;
    border-radius: 20px;
    border: unset;
}

.el-upload ,.el-upload-dragger{
  width: 100% !important;
  height: 130px;
}
.dashboard {
  padding: 0px;
  background-color: #EBEEF5; /* #fafbfc; */
  position: relative;
}
</style>
