<template>
  <el-card shadow="never" class="box-shadow">
    <div class="post">
      <div class="user-block">
        <img class="img-circle" :src="doc.createdBy.picture">
        <span class="username text-muted">
          <router-link :to="'/profile/' + doc.createdBy.id" class="link-type">
            <span>{{ doc.createdBy.id }}</span>
          </router-link>
          <span class="text-muted" style="margin: 0 8px;">&bull; {{ votersCounts }}</span>
          <el-button
            v-show="doc.follow"
            class="link-type"
            type="text"
            @click="follow(doc.createdBy.id)"
          >follow</el-button>

        </span>

        <span class="description">Shared publicly -
          <timeago :datetime="doc.createdAt" :auto-update="60" />
        </span>
      </div>
      <h1>
        {{ doc.title }}
      </h1>
      <p style="margin-bottom: 2px;font-size: 14px;font-weight: 500;line-height: 1.428571429;letter-spacing: 0.6px;">
        {{ doc.abstract }}
      </p>

      <div style="transition-timing-function: ease;">
        <el-button v-show="!contunie && doc.desc" type="text" style="color: gray" @click="contunie = !contunie">Show
          more</el-button>
        <p v-show="contunie" style="font-size: 14px;line-height: 1.428571429;letter-spacing: 0.6px;">
          {{ doc.desc }}
          <el-button type="text" style="display: block;color: gray" @click="contunie = !contunie">Show lesse</el-button>
        </p>
      </div>
      <div class="" style="padding: 8px 20px; padding-bottom: 40px;max-width: 450px;">
        <div class="">
          <el-radio-group v-if="doc.porpostions" v-model="radio" style="width: 100%" size="mini">
            <el-radio
              v-for="item in doc.porpostions"
              :key="item._id"
              :label="item._id"
              style="display: block; margin: 8px 8px; width: 100%;"
              :style="{ background: createVoteProgress(item) }"
              size="small"
            >
              <span>{{ item.text }}</span>
              <!-- <el-progress :percentage="18" /> -->
            </el-radio>
          </el-radio-group>
        </div>
        <span
          v-if="doc.voted !== undefined"
          style="float: right;margin: 6px 0px;padding: 6px 0px;color: gray;font-size: 12px;"
        >
          <span style="margin: 0 8px;">&bull;</span> Voted
          <timeago :datetime="doc.voted.votedate" :auto-update="60" />
        </span>

        <el-button
          v-else
          v-show="!doc.endAt || new Date(doc.endAt) - new Date() > 0"
          type="text"
          style="float: right; margin: 6px 0px;padding: 6px 16px;margin-left: 8px"
          plain
          border
          :disabled="!radio"
          :loading="loading"
          @click="onVote(doc.id)"
        >Vote</el-button>
        <span v-show="doc.endAt" style="float: right; margin: 6px 0px;padding: 6px 0px;color: gray;font-size: 12px;"><span
          style="margin: 0 8px;"
        >&bull;</span>{{ getDeffrence(doc.endAt) }} </span>
        <span style="float: right; margin: 6px 0px;padding: 6px 0px;color: gray;font-size: 12px;"> {{ doc.voteCount }}
          votes </span>
      </div>

      <ul v-if="error" class="list-inline">
        <li>
          <span class="link-black text-md">
            <el-tag type="danger">{{ error }}</el-tag>
          </span>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
import { followUser } from '@/api/user'
import { mapGetters } from 'vuex'
const Tx = require('ethereumjs-tx')
const ethereum = require('ethereumjs-utils')
// import paillier from '../../../../node_modules/paillier-bignum/src/paillier.js'
// const bignum = require('big-integer')

const contract = 'Haal'
export default {
  name: 'Post',
  props: {
    doc: { type: Object, default: () => ({}) }
    // keypair: {type: Object, default: () => ({ privKey: '' })}
  },
  data() {
    return {
      error: null,
      loading: false,
      radio: this.doc.voted?.votedOn,
      contunie: false,
      avatarPrefix,
      carouselImages: 'https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg'
    }
  },
  computed: {
    ...mapGetters('drizzle', ['drizzleInstance']),
    ...mapGetters(['stealth']),
    ...mapGetters('contracts', ['getContractData']),
    votersCounts() {
      return this.getContractData({
        contract: contract,
        method: 'votesCount'
      })
    },

    web3() {
      return this.drizzleInstance.web3
    }
  },
  created() {
    this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
      contractName: contract,
      method: 'encryptionPublicKey',
      methodArgs: []
    })
    this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
      contractName: contract,
      method: 'votesCount',
      methodArgs: []
    })
  },

  methods: {
    follow(id) {
      followUser({ userId: id }).then((response) => {
        console.log(response)
      }).catch(() => { })
    },
    getDeffrence(date_future) {
      // get total seconds between the times
      date_future = new Date(date_future)
      if (!date_future) { return '' }
      var date_now = new Date()

      if (date_future - date_now < 0) { return 'Vote ended' }
      var delta = Math.abs(date_future - date_now) / 1000

      // calculate (and subtract) whole days
      var days = Math.floor(delta / 86400)

      if (days > 5) { return `${days} days left` }
      delta -= days * 86400

      // calculate (and subtract) whole hours
      var hours = Math.floor(delta / 3600) % 24
      if (hours > 1) { return `${hours} hours left` }
      delta -= hours * 3600

      // calculate (and subtract) whole minutes
      var minutes = Math.floor(delta / 60) % 60
      if (minutes > 1) { return `${minutes} minutes left` }
      return `less than a minute`
    },
    createVoteProgress(item) {
      return item.voteCount === 0 ? '' : `linear-gradient(to right, #e8f4ff ${item.voteCount / this.doc.voteCount * 100}%, white 0%)`
    },
    togle() {
      this.contunie === !this.contunie
    },
    fromAscii(value) {
      return this.web3.utils.utf8ToHex(value)
    },
    async onVote(post) {
      if (!this.error) {
        this.error
      }
      // console.log({postId: post})
      // console.log({votedOn: this.radio})
      // console.log({userid: this.id_})
      this.loading = true

      // encrypyt
      const res = this.getContractData({
        contract: contract,
        method: 'encryptionPublicKey'
      })
      const hex = this.drizzleInstance.web3.utils.hexToAscii(res)
      const _publicKey = JSON.parse(hex)
      // const publicKey = new paillier.PublicKey(bignum(_publicKey.n), bignum(_publicKey.g))
      // const propos = this.doc.porpostions
      // console.log(propos)
      // for (let i = 0; i < propos.length; i++) {
      //   let bn1 = bignum(propos[i])
      //   bn1 = bn1.mod(publicKey.n)
      //   while (bn1.lt(0)) bn1 = bn1.add(publicKey.n)
      //   // encrypt the vote with published pk
      //   paillier.PublicKey.apply
      //   propos[i] = publicKey.encrypt(propos[i])
      // }
      // console.log(propos)
      console.log(_publicKey)

      const haal = this.drizzleInstance.contracts[contract]
      const haalAddress = haal.address
      const ethAddress = this.stealth ? '0x' + ethereum.privateToAddress(this.stealth).toString('hex') : null

      const method = haal.methods.addVote(this.fromAscii(post), this.web3.utils.padRight(this.fromAscii(this.radio), 64))
      const encodedABI = method.encodeABI()

      const estimateGas2 = await this.web3.eth.estimateGas({
        from: ethAddress,
        to: haalAddress,
        data: encodedABI
      })

      // const contract = await this.web3.eth.Contract(minABI, haalAddress);

      const privateKey = Buffer.from(this.stealth, 'hex')

      console.log(`choised element ${this.web3.utils.padRight(this.fromAscii(this.radio), 64)}`)
      console.log(`estimateGas: ${estimateGas2}`)
      console.log(`EthStealth Address ${ethAddress}`)
      // console.log(`account balance ${await contract.methods.balanceOf(ethAddress).call()}`)

      try {
        const trasnCount = await this.web3.eth.getTransactionCount(ethAddress)
        const rawTx = {
          nonce: this.web3.utils.toHex(trasnCount),
          from: ethAddress,
          to: haalAddress,
          gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('6', 'gwei')),
          gasLimit: this.web3.utils.toHex('10000'),
          gas: estimateGas2,
          data: encodedABI
        }

        const unsignedTx = new Tx(rawTx)
        unsignedTx.sign(privateKey)

        const serializedTx = unsignedTx.serialize()
        const tx = await this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        const thiis = this
        console.log(`Transaction Hash ${tx.transactionHash}`)
        this.web3.eth.getTransactionReceipt(tx.transactionHash).then(result => {
          if (result.status) {
            thiis.$message({
              message: 'Vote commited to blockchain correctly.',
              type: 'success'
            })
          } else {
            thiis.$message.error('Oops, error commitimg vote')
          }
          this.loading = false
        })
      } catch (e) {
        if (e.code === -32000) {
          this.error = 'Insufficient funds for gas'
        }
        this.loading = false
        this.$message.error(e)
      }

      // this.drizzleInstance
      //       .contracts[contract]
      //       .methods['addVote']
      //       .cacheSend(this.fromAscii(post), this.fromAscii(this.radio));

      // votePost({ postId: post, votedOn: this.radio })
      //   .then((response) => {
      //     this.doc.voted = response.voted;
      //     this.doc.voteCount = response.voteCount;
      //     this.doc.porpostions = response.porpostions;
      //     this.loading = false
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    },
    date(date) {
      return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'long' }).format(new Date(date))
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio.is-bordered.is-checked {
  border-color: #DCDFE6;
}

.ellipse {
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.two-lines {
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  white-space: normal;
}

.el-card:hover {
  background-color: rgb(255 255 255 / 70%);
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
    color: rgb(0, 0, 0);

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
        cursor: pointer;
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

.user-bio-section {
  font-size: 14px;
  padding: 0px;

  .user-bio-section-body {
    border: 1px solid #dfe6ec;
    font-weight: bold;
    border-radius: 5px;
  }
}</style>
