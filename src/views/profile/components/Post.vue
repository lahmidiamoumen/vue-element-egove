<template>
  <el-card shadow="never" class="box-shadow">
    <div class="post">
      <div class="user-block">
        <img class="img-circle" :src="doc.createdBy.picture+avatarPrefix">
        <span class="username text-muted">
           <router-link :to="'/profile/'+doc.createdBy.id" class="link-type">
            <span>{{ doc.createdBy.id }}</span>
          </router-link>
          <span class="text-muted" style="margin: 0 8px;">&bull;</span>
          <el-button v-show="doc.follow" class="link-type" type="text" @click="follow(doc.createdBy.id)">follow</el-button>

        </span>

        <span class="description">Shared publicly - <timeago :datetime="doc.createdAt" :auto-update="60"></timeago></span>
      </div>
      <h1>
        {{ doc.title }}
      </h1>
      <p style="margin-bottom: 2px;font-size: 14px;font-weight: 500;line-height: 1.428571429;letter-spacing: 0.6px;">
        {{ doc.abstract }}
      </p>
      
      <div style="transition-timing-function: ease;">
        <el-button v-show="!contunie && doc.desc " type="text" style="color: gray" v-on:click="contunie = !contunie">Show more</el-button>
        <p v-show="contunie" style="font-size: 14px;line-height: 1.428571429;letter-spacing: 0.6px;">
          {{ doc.desc }}
          <el-button type="text" v-on:click="contunie = !contunie" style="display: block;color: gray">Show lesse</el-button>
        </p>
      </div>  
      <div class="" style="padding: 8px 20px; padding-bottom: 40px;max-width: 450px;">
        <div class="">
          <el-radio-group v-if="doc.porpostions" v-model="radio"  style="width: 100%" size="mini">
            <el-radio border v-for="item in doc.porpostions" :key="item._id" :label="item._id" style="display: block; margin: 8px 8px; width: 100%;" :style=" {background: createVoteProgress(item) }"  size="small">
              <span>{{ item.text }}</span>
              <!-- <el-progress :percentage="18" /> -->
            </el-radio>
          </el-radio-group>
        </div>
        <span v-if="doc.voted !== undefined" style="float: right; margin: 6px 0px;padding: 6px 0px;color: gray;font-size: 12px;"> <span style="margin: 0 8px;">&bull;</span> Voted <timeago  :datetime="doc.voted.votedate" :auto-update="60"></timeago> </span>
        
        <el-button v-else v-show="!doc.endAt || new Date(doc.endAt) - new Date() > 0" type="text" style="float: right; margin: 6px 0px;padding: 6px 16px;margin-left: 8px" plain :disabled="!radio" :loading="loading" @click="onVote(doc.id)">Vote</el-button>
        <span v-show="doc.endAt" style="float: right; margin: 6px 0px;padding: 6px 0px;color: gray;font-size: 12px;"><span style="margin: 0 8px;">&bull;</span>{{getDeffrence(doc.endAt)}} </span>
        <span style="float: right; margin: 6px 0px;padding: 6px 0px;color: gray;font-size: 12px;"> {{doc.voteCount}} votes </span>
      </div>

      <!-- <ul v-else class="list-inline">
          <li>
            <span class="link-black text-sm">
              <i class="el-icon-top" />
              Up
            </span>
          </li>
          <li>
            <span class="link-black text-sm">
              <i class="el-icon-bottom" />
              Down
            </span>
          </li>
          <li>
            <span class="link-black text-sm">
              <i class="el-icon-share" />
              Share
            </span>
          </li>
        </ul> -->
    </div>
  </el-card>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
import { votePost } from '@/api/article'
import { followUser } from '@/api/user'

export default {
  name: 'Post',
  props: {
    doc: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      loading: false,
      radio: this.doc.voted !== undefined ? this.doc.voted.votedOn : undefined,
      contunie: false,
      avatarPrefix,
      carouselImages: 'https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg'
    }
  },
  methods: {
    follow(id){
      followUser({userId: id}).then((response) => {
        console.log(response)
      }).catch(() => {

      })
    },
    getDeffrence(date_future) {
      // get total seconds between the times
      date_future = new Date(date_future);
      if(!date_future)
       return '';
      var date_now = new Date();

      if(date_future - date_now < 0)
        return 'Vote ended';
      var delta = Math.abs(date_future - date_now) / 1000;

      // calculate (and subtract) whole days
      var days = Math.floor(delta / 86400);

      if(days > 5)
        return `${days} days left`;
      delta -= days * 86400;

      // calculate (and subtract) whole hours
      var hours = Math.floor(delta / 3600) % 24;
      if(hours > 1)
        return `${hours} hours left`;
      delta -= hours * 3600;

      // calculate (and subtract) whole minutes
      var minutes = Math.floor(delta / 60) % 60;
      if(minutes > 1)
        return `${minutes} minutes left`;
      return `less than a minute`;
      delta -= minutes * 60;
      console.log(`minutes:  ${minutes}`)

      // what's left is seconds
      var seconds = delta % 60;  // in theory the modulus is not required
      console.log(`seconds:  ${seconds}`)
    },
    createVoteProgress(item) {
      return item.voteCount === 0 ? '' : `linear-gradient(to right, #e8f4ff ${item.voteCount/this.doc.voteCount*100}%, white 0%)`;
    },
    togle() {
      this.contunie === !this.contunie
    },
    onVote(post) {
      // console.log({postId: post})
      // console.log({votedOn: this.radio})
      // console.log({userid: this.id_})
      this.loading = true;
      votePost({ postId: post, votedOn: this.radio })
        .then((response) => {
          this.doc.voted = response.voted;
          this.doc.voteCount = response.voteCount;
          this.doc.porpostions = response.porpostions;
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
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
  display:inline-block;
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

    .username{
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
}
</style>
