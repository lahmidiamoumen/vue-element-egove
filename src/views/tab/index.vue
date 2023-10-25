<template>
  <div v-if="isDrizzleInitialized" class="app-container dashboard">
    <div v-if="user">
      <button @click.prevent="initStealth()">Stealth Init</button>

      <splitpanes split="vertical" style="padding: 0px 10%">
        <pane size="18" class="toolL" style="top: 50px;position: fixed;">
          <user-card :user="user" @sortChanged="sortChanged($event)" />
        </pane>
        <pane size="64" style="left: 22.5%;position: relative;max-width: 56%">
          <splitpanes horizontal>
            <pane>
              <div style="height: 300px; background-color: #373e4c;text-align: center;">
                <span>Hello {{ votersCounts }}</span>
              </div>
            </pane>
            <pane>
              <el-tabs v-model="activeTab">
                <el-tab-pane label="Recent" name="activity">
                  <activity :feed="feed" :is-home="true" @paginationGanged="sortChanged($event)" />
                </el-tab-pane>
                <el-tab-pane label="Unvoted" name="unvoted">
                  <activity :feed="feed" :is-home="true" :unvoted="true" @paginationGanged="sortChanged($event)" />
                </el-tab-pane>
                <el-tab-pane label="Voted" name="voted">
                  <activity :feed="feed" :is-home="true" :voted="true" @paginationGanged="sortChanged($event)" />
                </el-tab-pane>
                <el-tab-pane label="Following" name="following">
                  <activity :feed="feed" :is-home="true" :following="true" @paginationGanged="sortChanged($event)" />
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
  <div v-else>
    Loading...
  </div>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import UserCard from '../profile/components/UserCard'
import UserProfile from '../profile/components/UserProfile'
import { mapGetters } from 'vuex'
import Activity from '../profile/components/Activity'
import { fetchListAll } from '@/api/article'
import { pushStealth } from '@/api/user'

const Stealth = require('stealth_eth')
const coinkey = require('coinkey')

// you need to scan every transaction and look for the following:
// 1. does the transaction contain an OP_RETURN?
// 2. if yes, then extract the OP_RETURN
// 3. is the OP_RETURN data a compressed public key (33 bytes)?
// 4. if yes, check if mine

// generate two key pairs, can use CoinKey, bitcoinjs-lib, bitcore, etc
var payloadKeyPair = coinkey.createRandom()
var scanKeyPair = coinkey.createRandom()

const contract = 'Haal'

export default {
  name: 'Profile',
  components: { UserCard, Activity, UserProfile, Splitpanes, Pane },

  data() {
    return {
      ewCount: 1,
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
      'id_',
      'name',
      'avatar',
      'roles',
      'stealth'
    ]),
    ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
    ...mapGetters('contracts', ['getContractData']),
    votersCounts() {
      return this.getContractData({
        contract: contract,
        method: 'votersCount'
      })
    },
    getEphemeralWallets() {
      return !this.isDrizzleInitialized ? undefined : this.getContractData({
        contract: contract,
        method: 'getEphemeralWallets'
      })
    }
  },
  mounted() {
    // if (!this.stealth) {
    //   var stealth = new Stealth({
    //     payloadPrivKey: payloadKeyPair.privateKey,
    //     payloadPubKey: payloadKeyPair.publicKey,
    //     scanPrivKey: scanKeyPair.privateKey,
    //     scanPubKey: scanKeyPair.publicKey
    //   })
    //   pushStealth(Object.assign({}, { id: this.id_ }, { token: stealth.toString() }))
    //     .then(response => {
    //       console.log(response)
    //     })
    //   console.log(stealth.toString())
    // } else {
    //   console.log('true')
    // }
    // this.initStealth(stealth)
  },
  created() {
    this.getUser()
    this.getListAll()
    this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
      contractName: contract,
      method: 'votersCount',
      methodArgs: []
    })
    // this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
    //         contractName: contract,
    //         method:'getEphemeralWallets',
    //         methodArgs:['ewCount'],
    //     });
  },
  methods: {
    async initStealth() {
      // if (!this.stealth) {
      let ew, opMarkerBuffer, pubKeyToRecoverBuffer, keypair
      var stealth = new Stealth({
        payloadPrivKey: payloadKeyPair.privateKey,
        payloadPubKey: payloadKeyPair.publicKey,
        scanPrivKey: scanKeyPair.privateKey,
        scanPubKey: scanKeyPair.publicKey
      })
      var that = this
      pushStealth(Object.assign({}, { id: this.id_ }, { token: stealth.toString() }))
        .then(async(response) => {
          console.log(response)
          that.ewCount = that.votersCounts
          console.log(`counts: ${that.ewCount}`)
          for (var i = 0; i < that.ewCount + 1; i++) {
            // ew =  this.drizzleInstance
            //         .contracts[contract]
            //         .methods['getEphemeralWallets'].cacheCall(i);

            ew = await this.drizzleInstance
              .contracts[contract]
              .methods.getEphemeralWallets(i).call()
            console.log('Ew was set to', ew)

            pubKeyToRecoverBuffer = Buffer.from(this.drizzleInstance.web3.utils.hexToAscii(ew[1]), 'hex')
            opMarkerBuffer = Buffer.from(ew[2].slice(2, 42), 'hex')
            keypair = stealth.checkPaymentPubKeyHash(pubKeyToRecoverBuffer, opMarkerBuffer)
            console.log(`keypair: ${keypair}`)
            if (keypair != null) break
          }
          if (keypair != null) {
            this.$store.commit('user/SET_STEALTH', keypair)
            console.log(`key pair found ! => ${keypair}`)
          }
        })
      // }
    },
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
