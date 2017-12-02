var audio = document.getElementById("audio");//获取视频对象
var play = document.getElementById("play");//获取播放按钮
var pause = document.getElementById("pause");//获取暂停按钮
var currentTime = document.getElementById("currentTime");//获取显示播放当前时间的元素
var duration = document.getElementById("duration");//获取显示总时长
var progressBar = document.getElementById("progressBar");//获取播放的进度条
var progresss = document.getElementById("progresss");//获取灰色的进度条
var progressBtn = document.getElementById("progressBtn");//视频的小原点
var volumeProgressBar = document.getElementById("volumeProgressBar");//获取音量进度条
var volumeProgress = document.getElementById("volumeProgress");//获取音量的灰色进度条
var volumeProgressBtn = document.getElementById("volumeProgressBtn");//获取音量小圆点
var btn1 = document.getElementById("btn1");//上一首
var btn2 = document.getElementById("btn2");//下一首
var playlist = document.getElementById("playlist");//下一首
var lis = playlist.getElementsByTagName("li");//播放列表
var mute1 = playlist.getElementsByTagName("mute1");//静音
var mute2 = playlist.getElementsByTagName("mute2");//不静音
audio.addEventListener("canplay", function () {
    play.onclick = function () {
        if (audio.paused) {
            audio.play();
            this.style.display = "none";
            pause.style.display = "block"
        }

    };

    pause.onclick = function () {
        if (!audio.paused) {
            audio.pause();
            this.style.display = "none";
            play.style.display = "block"
        }};
        mute1.onclick = function () {
            if (audio.muted){
                audio.muted = false;
               this.style.display = "none";
                mute1.style.display = "block"}
            else{
                audio.muted = true;
                this.style.display = "none";
                mute2.style.display = "block"
            }

   };
        mute2.onclick = function () {
            if (audio.muted =false) {
                audio.muted = true;
                this.style.display = "none";
                mute1.style.display = "block"
            }
        };

    duration.innerHTML = toMs(audio.duration);//写入总时长
    audio.addEventListener("timeupdate", function () {
        currentTime.innerHTML = toMs(audio.currentTime);
        var p = (audio.currentTime / audio.duration) * 100 + "%";//获取视频进度的百分比
        progressBar.style.width = p;//设置红色进度条的长度
    });
    //实现点击进度条,视频播放到当前点击的位置
    progresss.onclick = function (e) {
        var e = e || window.event;
        //offsetX 用于获取鼠标点击当前对象的相对坐标位置
        var x = e.offsetX; //获取鼠标点击的X 坐标
        var p = x / progresss.offsetWidth;//获取点击的进度比例
        var width = p * 100 + "%";//转成宽度属性需要的百分比
        //设置红色进度条的宽度
        progressBar.style.width = width;//设置红色进度条的宽度
        //设置music的当前播放时间
        audio.currentTime = audio.duration * p;
    };
    //实现点击音量进度条,控制视频的音量
    volumeProgress.onclick = function (e) {
        var e = e || window.event;
        //offsetX 用于获取鼠标点击当前对象的相对坐标位置
        var x = e.offsetX; //获取鼠标点击的X 坐标
        var p = x / volumeProgress.offsetWidth;//获取点击的进度比例
        var width = p * 100 + "%";//转成宽度属性需要的百分比
        //设置音量红色进度条的宽度
        volumeProgressBar.style.width = width;
        //设置对应的音量
        audio.volume = p;
    };
    var name = document.getElementById("name");
    //歌曲切换
    for (var i = 0; i < lis.length; ++i) {
        lis[i].onclick = function (e) {//点击播放该音乐
            name.innerHTML = this.innerHTML;
            e.preventDefault();
            audio.src = "Music/" + this.innerHTML + ".mp3";
            for (var j = 0; j < lis.length; ++j) {
                lis[j].className = '';
                audio.play();
                play.style.display = "none";
                pause.style.display = "block"
            }
            this.className = "plays";
        };

    }


    audio.onended = function () {//当音乐播放完自动播放下一首
        var index = getPlay();

        if (index == lis.length - 1) {//判断是否为最后一首，然后循环播放
            index = -1;
        }
        audio.src = "Music/" + lis[index + 1].innerHTML + ".mp3";//切换到下一首
        for (var j = 0; j < lis.length; ++j) {
            lis[j].className = '';
        }
        lis[index + 1].className = 'plays';
    };


    btn1.onclick = function () {//上一首

        var index = getPlay();
        if (index == 0) {//判断是否为第一首首，然后循环播放
            index = lis.length;
        }
        audio.src = "Music/" + lis[index - 1].innerHTML + ".mp3";//切换到上一首
        for (var j = 0; j < lis.length; ++j) {
            lis[j].className = '';
        }
        lis[index - 1].className = 'plays';
        audio.play();
        play.style.display = "none";
        pause.style.display = "block"
    };

    btn2.onclick = function () {//下一首
        var index = getPlay();
        if (index == lis.length - 1) {//判断是否为第一首首，然后循环播放
            index = -1;
        }
        audio.src = "Music/" + lis[index + 1].innerHTML + ".mp3";//切换到下一首
        for (var j = 0; j < lis.length; ++j) {
            lis[j].className = '';
        }
        lis[index + 1].className = 'plays';
        audio.play();
        play.style.display = "none";
        pause.style.display = "block"
    };
    function getPlay() {//获取当前正在播放的音乐的索引值
        for (var i = 0; i < lis.length; ++i) {
            if (lis[i].getAttribute('class') == "plays") {
                return i;
            }
        }
    }


});
//针对于点击小原点触发的冒泡事件导致的BUG
volumeProgressBtn.onclick = function (e) {
    e.stopPropagation();
};

progressBtn.onclick = function (e) {
    e.stopPropagation();
};

//定义时间转换
function toMs(time) {
    var m, s;//分，秒
    m = parseInt(time / 60);
    s = parseInt(time % 60);
    m = m < 10 ? '0' + m : m; //三目运算
    s = s < 10 ? '0' + s : s;
    return m + ':' + s; //将格式化的时间返回
}