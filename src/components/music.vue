<template>
	<div class="music">
		<audio id="audio" ref='audio' crossOrigin="anonymous" dataNum=0 ></audio>
		<div class="music-png">
			<div class="m-play" id="play" v-on:click='playClick'></div>
			<div class="m-pause" id="pause" style="display: none" v-on:click='pauseClick'></div>
			<img src="../assets/music.png">
		</div>
		<div class="music-wrap">
			<div class="music-show">
				<img src="http://lesses.me/my/beta1/moon.ico" class="ico">
				<div class="music-name">
					<div class="music-show-name" ref='showname'>
					</div>
				</div>
				<div class="music-bar" v-on:click='planClick'>
					<div class="music-plan">
					</div>
					<div class="music-drag" v-on:mousedown.stop='planDrag'></div>
				</div>
				<div class="music-time">- <span class="time-all" ref='alltime'>00:00</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import axios from 'axios'
	export default {
		components: {
		},
		data() {
			return {
				musicData:[], //音乐数组
				ifPlay: true, //是否播放
				planScales: 0,//进度默认为0
				musicLeft: 0, //进度位置
				curTime: 0,   //当前音乐时间
				ifHeader: 0,  //是否显示切换列表按钮
				audioUrl: null,//记录音乐链接
				lrcTime: {},  //歌曲时间轴
				lrcSecond: 0, //歌词毫秒数
			}
		},
		methods: {
			//获得音乐json文件
			getMusicData() {
				axios.get('http://lesses.me/music/static/music.json').then((response) => {
					this.musicData = response.data;
				},(response) => {
					console.log('失败');
				})
			},
			// 音乐播放/暂停
			playMusic() {
				let that = this;
				if(that.ifPlay) {
					that.$refs.audio.play();
					that.ifPlay = false;
					document.getElementById('play').style.display = 'none';
					document.getElementById('pause').style.display = 'block';
				}
				else {
					that.$refs.audio.pause();
					that.ifPlay = true;
					document.getElementById('play').style.display = 'block';
					document.getElementById('pause').style.display = 'none';
				}
			},
			//进度点击
			planClick(e) {
				let getAudio = document.getElementById('audio');
				let musicDarg = document.getElementsByClassName('music-drag')[0];
				let musicBar = document.getElementsByClassName('music-bar')[0];
				let musicPlan = document.getElementsByClassName('music-plan')[0];
				let musicShow = document.getElementsByClassName('music-show')[0];
				let musicWrap = document.getElementsByClassName('music-wrap')[0];
				this.musicLeft = e.clientX - musicWrap.offsetLeft - musicBar.offsetLeft;
				this.planScales = this.musicLeft / musicBar.offsetWidth;
				musicDarg.style.left = this.musicLeft + 'px';
				musicPlan.style.width = musicBar.offsetWidth * this.planScales + 'px';
				getAudio.currentTime = getAudio.duration * this.planScales;
				this.ifPlay = true;
				this.playMusic();
				this.curTime = Math.round(getAudio.currentTime);
			},
			//进度拖拽
			planDrag() {
				let getAudio = document.getElementById('audio');
				let musicDarg = document.getElementsByClassName('music-drag')[0];
				let musicBar = document.getElementsByClassName('music-bar')[0];
				let musicPlan = document.getElementsByClassName('music-plan')[0];
				let musicShow = document.getElementsByClassName('music-show')[0];
				let musicWrap = document.getElementsByClassName('music-wrap')[0];
				this.ifPlay = false;
				this.playMusic();
				let that = this;
				document.onmousemove = function(e) {
					that.musicLeft = e.clientX - musicBar.offsetLeft - musicWrap.offsetLeft - musicDarg.offsetWidth / 2;
					if(that.musicLeft <= 0) {
						that.musicLeft = 0;
					}
					if(that.musicLeft >= musicBar.offsetWidth) {
						that.musicLeft = musicBar.offsetWidth;
					}
					that.planScales = that.musicLeft / musicBar.offsetWidth;
					musicDarg.style.left = that.musicLeft + 'px';
					musicPlan.style.width = musicBar.offsetWidth * that.planScales + 'px';
				};
				document.onmouseup = function() {
					that.planScales = musicDarg.offsetLeft / musicBar.offsetWidth;
					getAudio.currentTime = getAudio.duration * that.planScales;
					that.ifPlay = true;
					that.playMusic();
					document.onmousemove = null;
					document.onmousedown = null;
					document.onmouseup = null;
					that.curTime = Math.round(getAudio.currentTime.toFixed(1));
					}
			},
			//加载完成获得第一首音乐的信息
			firstGet() {
				var Mnum = Math.round(Math.random() * this.musicData.length)
				this.$refs.audio.src = this.musicData[Mnum].url;
				this.$refs.showname.innerHTML = this.musicData[Mnum].name + ' - ' + this.musicData[Mnum].singer;
				let that = this;
				this.$refs.audio.addEventListener('canplaythrough',function() {
					that.timeActive();
					that.$refs.audio.volume = 0.8;
				})
			},
			//时间进度
			timeActive() {
				let myTime = this.$refs.audio.duration - this.$refs.audio.currentTime;
				let mySeconds = parseInt(myTime % 60);
				let myMinutes = parseInt(myTime / 60);

				if(mySeconds <= 9) {
					mySeconds = '0' + mySeconds;
				}
				if(myMinutes <= 9) {
					myMinutes = '0' + myMinutes;
				}

				this.$refs.alltime.innerHTML = myMinutes + ':' + mySeconds;
			},
			//音乐时间监听
			getMusicTime() {
				let audio = document.getElementById('audio');
				let musicDarg = document.getElementsByClassName('music-drag')[0];
				let musicBar = document.getElementsByClassName('music-bar')[0];
				let musicPlan = document.getElementsByClassName('music-plan')[0];
				let that = this;
				audio.addEventListener('timeupdate',function() {
					that.curTime = Math.round(audio.currentTime);
					that.planScales = audio.currentTime / audio.duration;
					musicPlan.style.width = musicBar.offsetWidth * that.planScales + 'px';
					musicDarg.style.left = musicBar.offsetWidth * that.planScales + 'px';
					that.timeActive();
					if(audio.ended) {
						that.ifPlay = true;
						document.getElementById('play').style.display = 'block';
						document.getElementById('pause').style.display = 'none';
					}
				})
			},
			//play点击
			playClick() {
				this.playMusic();
				document.getElementById('play').style.display = 'none';
				document.getElementById('pause').style.display = 'block';
			},
			//pause点击 
			pauseClick() {
				this.playMusic();
				document.getElementById('play').style.display = 'block';
				document.getElementById('pause').style.display = 'none';
			}
		},
		mounted() {
			this.getMusicData();
			this.timeActive();
			this.getMusicTime();
		},
		watch: {
			musicData: function(val,oldVal) {
				this.firstGet();
			}
		}
	}
</script>

<style>
	@import '../style/music.css';
</style>

