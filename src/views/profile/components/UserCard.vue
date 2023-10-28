<template>
  <div>
    <el-card :body-style="{ padding: '0px', height: '100vh' }" class="caredo">
      <div class="clearfix" style="padding: 10px">
        <div class="filter-container" style="width: 100%;">
          <el-input v-model="listQuery.q" placeholder="Search by keywords" size="large" prefix-icon="el-icon-search" @keyup.enter.native="handleFilter" />
        </div>
      </div>
      <h2 style="padding: 0px 20px;margin: 8px 0px ">Filter By</h2>

      <el-menu
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="0" style="padding-left: 40px;" @click="handleMenu(0)">
          <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/4mhXitnfwjM.png" alt="">
          <span>Popularity</span>
        </el-menu-item>
        <el-menu-item index="1" style="padding-left: 40px;" @click="handleMenu(1)">
          <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/xv1f8IDT6TY.png" alt="">
          <span>Friends</span>
        </el-menu-item>
        <el-menu-item index="2" style="padding-left: 40px;" @click="handleMenu(2)">
          <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/2XSFu6dqGH8.png" alt="">
          <span>Delegates</span>
        </el-menu-item>
      </el-menu>

      <div class="user-bio">
        <div class=" user-bio-section">
          <el-select
            v-model="listQuery.topics"
            size="small"
            multiple
            filterable
            collapse-tags
            style="width: 100%;padding: 0px 16px"
            placeholder="Select Topic of intrest"
            @change="handleFilter"
          >
            <el-option-group
              v-for="group in topMin"
              :key="group.label"
              :label="group.label"
            >

              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </div>

        <div class="user-education user-bio-section">
          <el-select
            v-model="listQuery.profession"
            filterable
            multiple
            size="small"
            collapse-tags
            style="width: 100%;padding: 0px 16px"
            placeholder="Select Profession"
            @change="handleFilter"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <div class="user-education user-bio-section" style="padding: 16px 16px">
          <div style="margin-bottom: 4px">
            <b>
              <svg-icon icon-class="education" />
              <span>Rate of approval </span>
            </b>
          </div>
          <el-slider v-model="rateOfApproval" style="margin: 0 25px" @change="handleFilter" />
        </div>

        <!-- <div>
          <el-checkbox v-model="checked2" label="Popularity" class="check" border size="medium" />
          <el-checkbox v-model="checked3" label="Friends" class="check" border size="medium" />
          <el-checkbox v-model="checked3" label="Delegates" class="check" border size="medium" />
        </div> -->

        <div class="chart-wrapper user-bio-section">
          <pie-chart />
        </div>

      </div>
    </el-card>
  </div>
</template>

<script>
import { categories, ministiries } from './data'
import PieChart from './PieChart'

export default {
  components: { PieChart },
  props: {
    sort: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    },
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  },
  data() {
    return {
      listQuery: {
        q: undefined,
        profession: [],
        topics: [],
        rateOfApproval: 0
      },
      topMin: [{
        label: 'Topics',
        options: Object.assign({}, categories)
      }, {
        label: 'Ministry',
        options: Object.assign({}, ministiries)
      }],
      options: Object.assign({}, categories),
      value1: [],
      ministerValue: [],
      checked1: false,
      checked2: false,
      checked3: false,
      rateOfApproval: 0
    }
  },
  methods: {
    handleMenu(index) {
      console.log(`cales ${index}`)
      // this.$emit('sortChanged',listQuery)
    },
    handleFilter() {
      console.log('cales')
      this.$emit('sortChanged', this.listQuery)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }

}
</script>

<style lang="scss" scoped>
.el-menu{
  background-color: transparent;
  border-right: unset
}
.check {
  display: block;width: 110px;margin: 2px 10px;border: none
}
.user-bio-section {
  border-top: 0.4px solid rgb(212, 213, 223);
}
.caredo {
  padding: 0px;
  margin-bottom:20px;margin-top: 0px;
  background-color: #f6f7f8;
  border: unset;
  border-right: 1px solid #dde0e6;
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 300;
    font-size: 16px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 12px;
  color: #3c3c3c;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
.chart-wrapper {
    padding: 8px 8px 0;
    margin: 32px 0px;
  }
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
