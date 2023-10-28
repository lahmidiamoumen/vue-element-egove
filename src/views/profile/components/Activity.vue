<template>
  <div class="user-activity" style="padding: 20px 5%">
    <el-card v-if="isHome" shadow="never" class="box-shadow">
      <div class="post">
        <div class="user-block">
          <img class="img-circle" :src="avatar + avatarPrefix">
          <span class="username text-muted">{{ id_ }}</span>
          <span class="description">Create new proposal</span>
        </div>

        <div v-if="!seen" class="footer-post">
          <el-button
            type="text"
            @click="seen = !seen"
          >
            Create new post</el-button>
        </div>

        <el-collapse-transition>
          <el-form
            v-show="seen"
            ref="form"
            :model="data"
            :inline="false"
            size="normal"
          >
            <el-form-item style="margin: 6px 20px">
              <label
                class="description"
                style="font-weight: bold; font-size: 14px"
              >
                Tile</label>
              <el-input
                v-model="data.title"
                type="textarea"
                rows="2"
                placeholder="Words Are More Powerful Than Any Weapon You Can Buy..."
              />
            </el-form-item>
            <el-form-item style="margin: 6px 20px">
              <label
                class="description"
                style="font-weight: bold; font-size: 14px"
              >Abstract
              </label>
              <el-input
                v-model="data.abstract"
                type="textarea"
                rows="4"
                placeholder="Words Are More Powerful Than Any Weapon You Can Buy..."
              />
            </el-form-item>
            <el-form-item style="margin: 6px 20px">
              <label
                class="description"
                style="font-weight: bold; font-size: 14px"
              >
                Description
              </label>
              <el-input
                v-model="data.desc"
                type="textarea"
                rows="6"
                placeholder="Words Are More Powerful Than Any Weapon You Can Buy..."
              />
            </el-form-item>
            <el-form-item
              label="Topics"
              label-width="100px"
              size="small"
              style="margin-top: 22px"
            >
              <el-select
                v-model="data.topics"
                size="larg"
                style="width: 85%"
                filterable
                collapse-tags
                placeholder="Select Topic of intrest"
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
            </el-form-item>

            <el-form-item label="Key words" label-width="100px" size="small">
              <el-select
                v-model="data.keyWord"
                size="default"
                style="width: 85%"
                multiple
                filterable
                allow-create
                placeholder="Add tags for your article"
              >
                <el-option
                  v-for="item in categories"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <div style="margin: 7px; margin-left: 40px">
              <el-tag
                v-for="item of data.keyWord"
                :key="item"
                style="margin-right: 15px; margin-top: 5px"
                size="small"
              >
                {{ item }}
              </el-tag>
            </div>

            <div style="margin: 0 auto">
              <el-upload
                class="upload-demo"
                style="margin: 20px 12px"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="data.fileList"
                multiple
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
                </div>
                <div slot="tip" class="el-upload__tip">
                  jpg/png files with a size less than 500kb
                </div>
              </el-upload>
            </div>

            <el-collapse style="margin-bottom: 12px; margin-right: 20px">
              <el-collapse-item title="Customize voting" name="1">
                <div
                  style="
                    margin: 10px 50px;
                    padding: 30px;
                    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
                    margin-right: 80px;
                    border-radius: 4px;
                  "
                >
                  <div
                    v-for="(con, index) in data.porpostions"
                    :key="index + '_' + con.key"
                  >
                    <el-row style="padding: 4px 0px" :gutter="6">
                      <el-col :span="20">
                        <el-input
                          v-model="con.text"
                          :placeholder="
                            'Poroposal suggestion ' + (index + 1) + '...'
                          "
                          size="small"
                          clearable
                        />
                      </el-col>
                      <el-col :span="2">
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          size="small"
                          :disabled="index < 2"
                          @click="removeOption(index)"
                        />
                      </el-col>
                    </el-row>
                  </div>

                  <div style="display: grid">
                    <el-button
                      type="text"
                      size="small"
                      icon="el-icon-plus"
                      style="
                        margin-top: 6px;
                        padding: 8px;
                        grid-area: last-line / 9;
                      "
                      plain
                      @click="addOption(index)"
                    >
                      Add new vote option
                    </el-button>

                    <el-form-item
                      style="margin-bottom: 2px; margin-right: 20px"
                    >
                      <label
                        for=""
                        class="description"
                        style="font-weight: 300; margin-right: 8px"
                      >Deadline</label>
                      <el-date-picker
                        v-model="data.endAt"
                        size="small"
                        type="date"
                        placeholder="Pick a day"
                      />
                    </el-form-item>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-form-item>
              <el-button
                style="float: right; margin-right: 20px"
                type="primary"
                size="small"
                @click="createPostMeth"
              >Submit</el-button>
            </el-form-item>
            <div v-if="seen" class="footer-post">
              <el-button type="text" @click="seen = !seen">Hide</el-button>
            </div>
          </el-form>
        </el-collapse-transition>
      </div>
    </el-card>

    <el-card shadow="never" class="box-shadow">
      <div class="post">
        <b>Votes Count: </b> {{ votesCount }} <br>
        <b> Stealth Account Blance: </b> {{ balance }} <br>
        <b>Stealth Account Hash: </b> {{ ethAddress }}
        <span style="visibility: hidden">{{ getBalanced() }}</span>
      </div>
    </el-card>
    <el-card class="box-shadow">
      <div class="post">
        <div v-for="(porp, index) in contractProposals" :key="index">
          <br>

          <el-card shadow="hover" :body-style="{ padding: '20px' }">
            <div slot="header">
              <span><b>Creator</b> {{ porp[0] }}</span>
            </div>
            <table>
              <tr>
                <b>Vote text keys</b>
                <br>
                {{
                  convertArray(porp[1])
                }}
              </tr>
              <tr>
                <b>Vote Count</b>
                <br>
                {{
                  porp[2]
                }}
              </tr>
              <tr>
                <b>Post ID </b>
                <br>
                {{
                  convert(porp[3])
                }}
              </tr>
              <tr>
                <b>Proposal ids</b>
                <br>
                {{
                  convertArray(porp[4])
                }}
              </tr>
            </table>
          </el-card>
        </div>
      </div>
    </el-card>
    <div v-for="(item, index) in feed.list" :key="index">
      <Post :doc="item" />
    </div>
    <div v-if="feed.listLoading" class="post">
      <p style="width: 100%; text-align: center">Loading posts...</p>
    </div>

    <div class="post">
      <div class="user-block">
        <img
          class="img-circle"
          :src="
            'https://wpimg.wallstcn.com/fb57f689-e1ab-443c-af12-8d4066e202e2.jpg' +
              avatarPrefix
          "
        >
        <span class="username">BrightGov</span>
        <span class="description">Posted 4 photos - 2 days ago</span>
      </div>
      <div class="user-images">
        <el-carousel :interval="6000" type="card" height="220px">
          <el-carousel-item v-for="item in carouselImages" :key="item">
            <img :src="item + carouselPrefix" class="image">
          </el-carousel-item>
        </el-carousel>
      </div>
      <ul class="list-inline">
        <li>
          <span
            class="link-black text-sm"
          ><i class="el-icon-share"> Share</i></span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" /> Like</span>
        </li>
      </ul>
    </div>

    <pagination
      v-show="feed.total > 0"
      :total="feed.total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getListAll"
    />
  </div>
</template>

<script>
import Post from './Post'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const ethereum = require('ethereumjs-utils')
import { createPost } from '@/api/article'
import { mapGetters } from 'vuex'
import { categories, ministiries } from './data'
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'
const contract = 'Haal'

export default {
  components: { Pagination, Post },
  props: {
    isHome: { type: Boolean, default: false },
    unvoted: { type: Boolean, default: false },
    voted: { type: Boolean, default: false },
    following: { type: Boolean, default: false },
    feed: {
      type: Object,
      default: () => {
        return {
          list: [],
          total: 0,
          listLoading: true
        }
      }
    }
  },
  data() {
    return {
      getBalance: '',
      datePickerOptions: {
        disabledDate(newDate) {
          var date = new Date()
          date.setDate(date.getDate() - 1)
          return newDate < date
        }
      },
      proposBt: [],
      balance: '',
      seen: false,
      topMin: [
        {
          label: 'Topics',
          options: Object.assign({}, categories)
        },
        {
          label: 'Ministry',
          options: Object.assign({}, ministiries)
        }
      ],
      categories: Object.assign({}, categories),
      value: '',
      keyWord: [],
      data: {
        title: '',
        desc: '',
        abstract: '',
        topics: '',
        keyWord: [],
        fileList: [],
        yesVote: 0,
        noVote: 0,
        endAt: undefined,
        porpostions: [
          { kye: 12222, text: 'Yes' },
          { kye: 123312, text: 'No' }
        ]
      },

      listQuery: {
        page: 1,
        limit: 20,
        following: this.following,
        unvoted: this.unvoted,
        voted: this.voted
      },
      carouselImages: [
        'https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg',
        'https://wpimg.wallstcn.com/bcce3734-0837-4b9f-9261-351ef384f75a.jpg',
        'https://wpimg.wallstcn.com/d1d7b033-d75e-4cd6-ae39-fcd5f1c0a7c5.jpg',
        'https://wpimg.wallstcn.com/50530061-851b-4ca5-9dc5-2fead928a939.jpg'
      ],
      avatarPrefix,
      carouselPrefix
    }
  },
  computed: {
    ...mapGetters(['id_', 'avatar', 'stealth']),
    ...mapGetters('drizzle', ['drizzleInstance']),
    ...mapGetters('contracts', ['getContractData']),

    votesCount() {
      return this.getContractData({
        contract: contract,
        method: 'votesCount'
      })
    },
    contractProposals() {
      return this.getContractData({
        contract: contract,
        method: 'getproposals'
      })
    },
    web3() {
      return this.drizzleInstance.web3
    },
    ethAddress() {
      // console.log(this.stealth)
      // return Buffer.from(this.stealth.privKey, 'hex')
      return this.stealth
        ? '0x' + ethereum.privateToAddress(this.stealth).toString('hex')
        : ''
    }
  },
  created() {
    this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
      contractName: contract,
      method: 'getproposals',
      methodArgs: []
    })
    this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
      contractName: contract,
      method: 'votesCount',
      methodArgs: []
    })
  },
  methods: {
    async getBalanced() {
      const b = this.ethAddress !== '' ? (Number(await this.web3.eth.getBalance(this.ethAddress)) * Math.pow(10, -9)).toFixed(4) : ''
      this.balance = b
      return b
    },
    convertArray(arr) {
      const list = []
      const thiis = this
      arr?.forEach((e) => list.push(thiis.convert(e)))
      return list
    },
    convert(byte32) {
      return typeof byte32 === 'undefined' || byte32 === '' || byte32 === '0x00'
        ? 'Empty content!'
        : this.drizzleInstance.web3.utils.hexToUtf8(byte32.toString(16))
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    addOption() {
      this.data.porpostions.push({ key: Date.now(), text: '' })
    },
    removeOption(index) {
      if (this.data.porpostions.length <= 2) {
        alert('We need at least two fields')
      } else {
        this.data.porpostions.splice(index, 1)
      }
    },
    fromAscii(value) {
      return this.drizzleInstance.web3.utils.utf8ToHex(value)
    },

    createPostMeth() {
      // to blockchain

      createPost(this.data).then((response) => {
        const porpostionsID = []
        response.porpostions.forEach((element) => {
          porpostionsID.push(this.fromAscii(element._id))
        })

        console.log(`response id ${response.id}`)
        console.log(`porpostions IDs ${porpostionsID}`)
        if (response) {
          this.drizzleInstance.contracts['Haal'].methods[
            'addProposals'
          ].cacheSend(this.fromAscii(response.id), porpostionsID)
        }

        // const createdBy = {
        //   id: this.id_,
        //   picture: this.avatar
        // }
        // const createdAt = Date.now()
        this.feed.list.unshift(response)
        this.data.desc = ''
      })
    },
    getListAll() {
      // console.log(this.id_)
      // this.listLoading = true
      // fetchListAll(this.listQuery).then(response => {
      //   this.list = response.rows
      //   this.total = Number.isNaN(parseInt(response.count)) ? 0 : parseInt(response.count)
      //   this.listLoading = false
      // })
      this.$emit('paginationGanged', this.listQuery)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-post {
  text-align: center;
  border-top: 1px solid rgb(221, 221, 221);
  margin-top: 20px;
}

.footer-post:hover {
  background-color: rgba(236, 236, 243, 0.438);
}

.box-shadow {
  border: unset;
  border-radius: max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) / 8px;
  box-shadow: 0 1px 2px #00000040;
  margin-bottom: 16px;
}

.el-upload-dragger .el-upload {
  width: 100% !important;
}

.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    // border-bottom: 1px solid #d2d6de;
    // margin-bottom: 15px;
    // padding-bottom: 15px;
    color: #050505;
    font-size: 0.9375rem;
    word-wrap: break-word;
    line-height: 1.3333;

    .image {
      width: 100%;
      height: 100%;
    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {
      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
