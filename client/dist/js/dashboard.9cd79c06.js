(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["dashboard"],{"09e0":function(t,e,s){},2352:function(t,e,s){"use strict";var i=s("ec72"),a=s.n(i);a.a},"2b56":function(t,e,s){"use strict";var i=s("09e0"),a=s.n(i);a.a},"32fe":function(t,e,s){},"45e7":function(t,e,s){"use strict";var i=s("32fe"),a=s.n(i);a.a},"5eb8":function(t,e,s){},"5fed":function(t,e,s){"use strict";var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{directives:[{name:"show",rawName:"v-show",value:!t.$store.state.transition,expression:"!$store.state.transition"}],staticClass:"photos",attrs:{id:"intersection"}},[s("div",{staticStyle:{display:"flex","flex-wrap":"wrap","align-items":"center","justify-content":"center",height:"100%",width:"100%"}},t._l(t.photos,(function(e,i){return s("div",{key:i+""+Math.random(),staticClass:"photo",class:[t.lightMode?"dark_shadows":"light",i<t.perPage?"":"intersect",t.isPhotoLikeable(e)?"":"disable_grayscale"],staticStyle:{width:"200px",height:"200px"},style:{visibility:i<t.perPage?"":"hidden",opacity:i<t.perPage?1:0}},[s("lazy-component",{staticStyle:{height:"100%",width:"100%","z-index":"1"}},[s("img",{staticStyle:{width:"100%",height:"100%","object-fit":"cover"},attrs:{src:e.src.medium?e.src.medium:e.src.small}})]),s("div",{staticStyle:{"z-index":"2",background:"transparent"}},[s("Photo",{attrs:{photo:e},on:{like:function(e){return t.callbackFunc()}}})],1)],1)})),0),t.photos&&0==t.photos.length||!t.photos?s("b-message",{key:"message",staticClass:"my-2",staticStyle:{"animation-duration":"100ms"},attrs:{type:"is-danger"}},[t._v("There is nothing here... ")]):t._e()],1)},a=[],o=s("7856"),r={props:["name","userPhotos","pageStart","pageEnd"],data(){return{offsetTop:0,currentPage:1,total:null,loaded:!1}},watch:{photos(){this.callbackFunc()},offsetTop(t){this.callbackFunc()}},components:{Photo:o["a"]},computed:{likedImgs(){const t=localStorage.getItem("likedPhotos"),e=this.$store.getters.getCurrentUsersFavourites;return e?e&&t?[...JSON.parse(t),...e]:[]:JSON.parse(t)},perPage(){return window.innerWidth>=1920?24:window.innerWidth>=1440?16:window.innerWidth>=1280||window.innerWidth>=768?12:8},lightMode(){return this.$store.getters["getNightMode"]},photos(){if("curated"==this.$props.name)return console.log(this.pageStart,this.pageEnd),this.$store.getters.getCuratedPhotos.slice(this.pageStart,this.pageEnd);if("random"==this.$props.name)return this.$store.getters.getRandomPhotos;if("user"==this.$props.name){const t=this.$store.getters.getCurrentUsersFavourites.slice(this.pageStart,this.pageEnd);return t||[]}if("guest"==this.$props.name){const t=this.$store.getters.getFavourites.slice(this.pageStart,this.pageEnd);return t||[]}if("search"==this.$props.name)return this.$store.getters.getSearchResults;if("profile"==this.$props.name){const t=this.$store.getters.getCurrentUsersFavourites;return t.reverse()}if("profileID"==this.$props.name){const t=this.$props.userPhotos;return t.reverse()}return"dashboard"==this.$props.name?this.$store.getters.getDashboard.slice(this.pageStart,this.pageEnd):[]}},methods:{isPhotoLikeable(t){const e=this.likedImgs.find(e=>e.url==t.url);return!e},onScroll(t){console.log("scrolling");const e=document.getElementById("intersection");this.offsetTop=e.scrollTop},isElementInViewport(t){const e=document.getElementById("intersection"),s=t.getBoundingClientRect();return s.top>=-100&&s.bottom<=(e.innerHeight||e.clientHeight)+400},callbackFunc(){const t=document.querySelectorAll(".intersect");for(let e=0;e<t.length;e++)this.isElementInViewport(t[e])?t[e].classList.add("in-view"):t[e].classList.remove("in-view")}},async mounted(){const t=this,e=document.getElementById("intersection");switch(e.addEventListener("scroll",this.onScroll),this.$store.commit("showLoader"),this.$props.name){case"curated":this.$store.dispatch("getCuratedPexels",this.$buefy);break;case"random":setTimeout(()=>{t&&t.$store.dispatch("getRandomPexels",this.$buefy)},300);break;case"user":break;case"guest":this.$store.dispatch("loadFavourites",this.$buefy);break}this.callbackFunc(),setTimeout(()=>{t&&(t.loaded=!0)},2e3)},destroyed(){const t=document.getElementById("intersection");t.removeEventListener("scroll",this.onScroll)}},n=r,l=(s("45e7"),s("2877")),c=Object(l["a"])(n,i,a,!1,null,null,null);e["a"]=c.exports},"6e82":function(t,e,s){"use strict";var i=s("5eb8"),a=s.n(i);a.a},7277:function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"title"},[s("h1",{style:{color:t.nm?"#ddd":"#333"}},[t._v("Dashboard")]),s("p",{staticStyle:{"font-size":"12px",opacity:"0.75","margin-top":"5px"}},[t._v("Explore new content by your interests on Pexies.")])]),s("div",{staticClass:"container"},[s("div",{staticClass:"row"},[s("transition-group",{staticClass:"columns",attrs:{tag:"div",name:"fadeUp",mode:"out-in"}},[s("div",{key:"content",staticClass:"column is-9",class:{extend:!t.showNavbar}},[s("Photos",{attrs:{pageStart:t.pagination.current*t.perPage-t.perPage,pageEnd:t.pagination.current*t.perPage,name:"dashboard"}})],1),s("div",{key:"tags",staticClass:"column is-3",staticStyle:{transition:"300ms all"},style:[!t.showNavbar&&t.width<500?"height: 1px!important; min-height: 1px!important":"",t.width<500&&t.showNavbar?"min-height: 30vh!important; height:30vh;":""]},[t.showNavbar?s("p",{staticClass:"my-2",staticStyle:{"font-size":"12px",opacity:"0.75","margin-top":"5px"}},[t._v("Add a tag to favourites by double clicking on it.")]):t._e(),t.showNavbar?s("DashboardTags",{on:{tagChange:function(e){return t.tagChange(e)}}}):t._e()],1)])],1)]),s("div",{staticClass:"bottom-bar",class:t.nm?"bg-dark":"",style:{color:t.nm?"#ddd!important":"#333!important"}},[s("pagination",{class:t.nm?"bg-dark":"",style:{color:t.nm?"#ddd!important":"#333!important"},attrs:{type:"is-warning",order:"is-centered","icon-pack":"fa",pagination:t.pagination,"per-page":t.perPage},on:{pageChange:function(e){return t.pageChange(e)}}})],1)])},a=[],o=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("h6",[t._v("Popular Tags")]),s("transition-group",{attrs:{tag:"b-taglist",name:"fade",mode:"out-in"}},t._l(t.tags,(function(e){return s("b-tag",{key:e.title,staticClass:"noselect",class:t.activeTag==e.title?"is-danger":"is-warning",staticStyle:{cursor:"pointer"},attrs:{unselectable:"on",type:"is-warning"},nativeOn:{click:function(s){return s.preventDefault(),t.onClick(e.title)}}},[t._v(t._s(e.title)+" ")])})),1),s("p",{staticClass:"my-2",staticStyle:{display:"inline-block","text-align":"right","font-size":"12px",cursor:"pointer"},on:{click:function(e){t.showAllTags=!t.showAllTags}}},[t._v(" "+t._s(t.showAllTags?"Show less tags.":"Show more tags."))]),t.interests.length>0?s("h6",[t._v("Your Interests")]):t._e(),t.interests.length>0?s("transition-group",{attrs:{tag:"b-taglist",name:"fade",mode:"out-in"}},t._l(t.localTags,(function(e){return s("b-tag",{key:e,staticClass:"noselect",class:t.activeTag==e?"is-danger":"is-warning",staticStyle:{cursor:"pointer"},style:{color:t.darkMode?"#ddd!important;":"#333!important;"},attrs:{unselectable:"on",type:"is-warning"},nativeOn:{click:function(s){return s.preventDefault(),t.onClick(e)}}},[t._v(" "+t._s(e)+" ")])})),1):t._e(),t.localTags.length>0?s("p",{staticClass:"my-2",staticStyle:{"text-align":"right","font-size":"12px",cursor:"pointer",display:"inline-block"}},[t._v("Show all your interests.")]):t._e()],1)},r=[],n={name:"DashboardTags",data(){return{localTags:[],clicks:0,delay:500,activeTag:"",timer:null,showAllTags:!1}},computed:{tags(){const t=this.$store.state.tags.slice();return this.showAllTags?t.sort((t,e)=>t-e):t.sort((t,e)=>t-e).slice(0,10)},interests(){const t=localStorage.getItem("interests");return t?JSON.parse(t)==this.localTags?this.localTags:JSON.parse(t):[]},darkMode(){return this.$store.getters["getNightMode"]},dashboardContentLength(){return this.$store.getters.getDashboard.length}},methods:{onClick(t){const e=this;this.clicks++,1===this.clicks?this.timer=setTimeout((function(){e.changeTag(t),e.clicks=0}),e.delay):(clearTimeout(this.timer),e.isTagAddable(t)?e.addTagToInterests(t):e.removeTagFromInterests(t),this.clicks=0)},isTagAddable(t){return this.interests.indexOf(t)<=0},addTagToInterests(t){let e=localStorage.getItem("interests");e?(e=JSON.parse(e),e.push(t),e=[...new Set(e)],this.localTags=[...new Set(this.localTags),t],e=JSON.stringify(e),localStorage.setItem("interests",e)):(e=[t],e=JSON.stringify(e),localStorage.setItem("interests",e))},removeTagFromInterests(t){let e=localStorage.getItem("interests");if(e){e=JSON.parse(e);const s=e.indexOf(t);s>-1&&(e.splice(s,1),e=JSON.stringify(e),localStorage.setItem("interests",e),this.localTags=[...new Set(this.localTags)],this.localTags=this.localTags.filter(e=>e!==t))}},changeTag(t){this.activeTag=t,this.$emit("tagChange",t)}},created(){this.dashboardContentLength&&0!==this.dashboardContentLength||this.$store.dispatch("getDashboard"),localStorage.getItem("interests")?this.localTags=JSON.parse(localStorage.getItem("interests")):this.localTags=[]}},l=n,c=(s("6e82"),s("2877")),h=Object(c["a"])(l,o,r,!1,null,null,null),p=h.exports,g=s("5fed"),d={name:"Dashboard",components:{Photos:g["a"],DashboardTags:p},data(){return{showNavbar:!0,lastScrollPosition:0,perPage:20,pagination:{name:"dashboard",current:1,rangeBefore:2,rangeAfter:2,prevIcon:"chevron-left",nextIcon:"chevron-right"}}},computed:{nm(){return this.$store.getters.getNightMode},width(){return window.innerWidth}},methods:{onScroll(){const t=document.getElementById("intersection"),e=t.scrollTop;e<0||(console.log(e,this.lastScrollPosition),Math.abs(e-this.lastScrollPosition)<60||(this.showNavbar=e<this.lastScrollPosition,this.lastScrollPosition=e))},pageChange(t){this.pagination.current=t},tagChange(t){this.$store.dispatch("getDashboard",t)}},mounted(){this.$store.commit("hideLoader"),0!=this.$store.getters.getAuth&&window.innerWidth<500&&document.getElementById("intersection").addEventListener("scroll",this.onScroll)},beforeDestroy(){window.innerWidth<500&&document.getElementById("intersection").removeEventListener("scroll",this.onScroll)}},u=d,m=(s("2b56"),Object(c["a"])(u,i,a,!1,null,null,null));e["default"]=m.exports},7856:function(t,e,s){"use strict";var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return t.propCopy?s("div",{staticClass:"photo_link_wrapper"},[s("b-tag",{staticClass:"photographer",attrs:{type:"is-primary"}},[t.propCopy.photographer_url?s("a",{staticStyle:{color:"white"},attrs:{target:"_blank",href:t.propCopy.photographer_url}},[t._v(" "+t._s(t.propCopy.photographer&&t.propCopy.photographer.length>15?t.propCopy.photographer.substring(0,15)+"...":t.propCopy.photographer+"unknown")+" ")]):t._e()]),s("transition-group",{staticClass:"like_button",attrs:{tag:"div",name:"fade",mode:"out-in"}},[s("span",{directives:[{name:"show",rawName:"v-show",value:t.isPhotoLikeable(t.propCopy)&&"/favourites"!==t.path,expression:"isPhotoLikeable(propCopy) && path !== '/favourites'"}],key:"like",on:{click:function(e){return t.like(t.propCopy)}}},[s("i",{staticClass:"fa fa-heart btn_icon"})]),s("span",{directives:[{name:"show",rawName:"v-show",value:!t.isPhotoLikeable(t.propCopy),expression:"!isPhotoLikeable(propCopy)"}],key:"dislike",on:{click:function(e){return t.dislike(t.propCopy)}}},[s("i",{staticClass:"fa fa-times btn_icon"})])]),s("span",{staticClass:"expand_button",on:{click:t.expand}},[s("i",{staticClass:"fa fa-expand btn_icon"})]),s("span",{staticClass:"visit_button",on:{click:t.visit}},[s("i",{staticClass:"fa fa-search btn_icon"})])],1):t._e()},a=[],o=s("9ab4"),r=s("2b0e"),n=r["a"].extend({props:["photo"],data:function(){return{propCopy:{}}},created:function(){this.propCopy=JSON.parse(JSON.stringify(this.photo)),this.$emit("like")},mounted:function(){this.$emit("like")},methods:{expand:function(t){this.$store.commit("showLoader");var e=document.createElement("img");e.src=this.propCopy.src.original,e.onload=function(t){if(t.path&&t.path[0]){var e=t.path[0].naturalWidth/t.path[0].naturalHeight;i(e)}};var s=this;function i(t){var e;e=t<.5?"4by3":"16by9";var i=s.$createElement,a=i("p",{class:"image modal_image is-"+e},[i("img",{attrs:{src:s.propCopy.src.original}})]);s.$store.dispatch("expandPhoto",{$el:a,$buefy:s.$buefy})}},visit:function(){window.open(this.propCopy.url,"_blank")},like:function(t){this.isPhotoLikeable(t)?(this.propCopy.liked=!0,this.$store.dispatch("likePhoto",{photo:t,username:this.$store.state.auth.user.username,$buefy:this.$buefy}),this.$emit("like")):this.$buefy.toast.open({message:"You already liked this photo.",type:"is-danger"})},dislike:function(t){var e=this.$store.getters.getCurrentUser.username;this.$store.dispatch("dislikePhoto",{photo:t,username:e,$buefy:this.$buefy}),this.$emit("like")},isPhotoLikeable:function(t){var e=this.likedImgs.find((function(e){return e.url==t.url}));return!e}},computed:{path:function(){return this.$route.path},likedImgs:function(){var t=localStorage.getItem("likedPhotos"),e=this.$store.getters.getCurrentUsersFavourites;return!e&&t?JSON.parse(t):t&&e?Object(o["c"])(JSON.parse(t),e):[]}}}),l=n,c=(s("2352"),s("2877")),h=Object(c["a"])(l,i,a,!1,null,null,null);e["a"]=h.exports},ec72:function(t,e,s){}}]);
//# sourceMappingURL=dashboard.9cd79c06.js.map