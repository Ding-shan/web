//模拟数据
var data = [{"title": "李代沫-遗憾", "singerPic": "images/ldm.jpg", "music": "Music/yh.mp3"},
    {"title": "陈奕迅-明年今日", "singerPic": "images/cyx.jpg", "music": "Music/mnjr.mp3"},
    {"title": "李代沫-骨子里的我", "singerPic": "images/ldm.jpg", "music": "Music/gzldw.mp3"},
    {"title": "陈奕迅-你的背包", "singerPic": "images/cyx.jpg", "music": "Music/ndbb.mp3"},
    {"title": "陈奕迅-陪你度过漫长岁月", "singerPic": "images/cyx.jpg", "music": "Music/pndgmcsy.mp3"},
    {"title": "李代沫-我是不是你最疼爱的人", "singerPic": "images/ldm.jpg", "music": "Music/wsbsnztadr.mp3"}];

var index = 0; //定义歌曲的索引值
var audio = $("#audio")[0];//获取音频对象
var mode = "loop";//loop 循环播放  random 随机播放

//插入歌曲列表
var htmlStr = ''; //接收创建的所有的歌曲li
var durationTime = 0;//定义一个播放的总时间
for(var i=0;i<data.length;i++){
    htmlStr+='<li>'+data[i].title+'</li>';
}

$("#playlist").html(htmlStr);
//首次加载默认使用第一首歌曲
$("#audio").attr("src",data[index].music);//设置歌曲路径

/*****************实现播放功能*******************/
$("#play").click(function(){
    //隐藏当前点击的播放按钮
    $(this).hide();
    //显示暂停按钮
    $("#pause").show();
    audio.play();
    toPlay(); //调用播放的其他的处理事件
})
/*****************实现暂停功能*******************/
$("#pause").click(function(){//点击暂停按钮实现暂停
    if(!audio.paused){
        audio.pause();//暂停
        $(this).hide();//隐藏暂停按钮
        $("#play").show();//显示播放按钮
    }
})
/*****************实现下一首功能*******************/
    $("#btn2").click(function(){
        index++;
        if(index>=data.length)index=0;
        $("#audio").attr("src",data[index].music);//设置歌曲路径
        toPlay();//执行播放操作
    })

/*****************实现上一首功能*******************/
$("#btn1").click(function(){
    index--;
    if(index<=0)index=data.length-1;
    $("#audio").attr("src",data[index].music);//设置歌曲路径
    toPlay();//执行播放操作

})
/**********************实现音乐进度调节功能*********************/
$("#progresss").click(function(e){
    var x = e.offsetX;//获取点击的坐标
    var w = $(this).width();
    var p = x / w;
    //设置音乐的进度
    //audio.currentTime=p*audio.duration;
    setCurrentTime(durationTime*p);
   console.log(audio.duration)
    //更新音量的条的样式
    $("#progressBar").css("width",(p*100)+"%");
})

/**********************实现音量调节功能*********************/
$("#volumeProgress").click(function(e){
    var x = e.offsetX;//获取点击的坐标
    var w = $(this).width();
    var p = x / w;
   //设置音量
    audio.volume=p;
   //更新音量的条的样式
   $("#volumeProgressBar").css("width",(p*100)+"%");
})

/************************阻止点击的冒泡事件************************************/
$("#progressBtn").click(function(e){
    e.stopPropagation();
})
$("#volumeProgressBtn").click(function(e){
    e.stopPropagation();
})
/**************************更改播放模式*****************************/
$(".repeat").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    mode = "loop";
})

$(".shuffle").click(function(){
    mode = 'random';
    $(this).addClass("active").siblings().removeClass("active");
})

//监听音频对象的时间更新事件
 audio.addEventListener("timeupdate",function(){
   // console.log(audio.currentTime)
     var duration = audio.duration;//获取当前音乐在总时长
     var currentTime = audio.currentTime;//获取当前的时间
     var p = (currentTime / duration *100)+"%"; //获取当前播放 的百分比
     $("#progressBar").css("width",p);
     $("#currentTime").html(toMs(audio.currentTime));//更新当前播放的时间

     if(audio.ended){//判断当前音乐是否已经播放完毕,播放完毕自动按模式进入下一首
            //判断用户选择的模式
         if(mode=="loop"){
             index++;
             if(index>=data.length)index=0;
             $("#audio").attr("src",data[index].music);//设置歌曲路径
             setCurrentTime(0);//把音乐的播放时间重置为0
             toPlay();
         }else if(mode=="random"){
               index = randomIndex();//生成随机数
             $("#audio").attr("src",data[index].music);//设置歌曲路径
             setCurrentTime(0);//把音乐的播放时间重置为0
             toPlay();
         }
     }

 })

//定义一个实现播放完整操作的函数
function toPlay(){
    //更换歌手图片
    $(".cover img").attr("src",data[index].singerPic);
    //更新歌曲的名字
    $("#name").html(data[index].title);
    //更新列表中正在播放歌曲的样式
    $("#playlist li").eq(index).addClass("plays").siblings().removeClass("plays");
    audio.addEventListener("canplay",function(){//监听音频可以播放
        durationTime = audio.duration;//获取总时长
        console.dir(audio)
        if(audio.paused){//实现播放
            audio.play();
        }
        //设置显示播放的时间
        $("#duration").html(toMs(durationTime));
    })
}

//定义一个设置播放时间的方法
function setCurrentTime(time){
    audio.currentTime=time;
}



//定义一个时间格式转换函数 :  00:30

function toMs(time){
    var m = parseInt(time/60);
	//获取分
    var s = parseInt(time%60);
	//获取秒
    m = m<10?'0'+m:m;
    s = s<10?'0'+s:s;
    return m+":"+s;
}

//定义一个获取随机索引值的函数
function randomIndex(){
    var num = parseInt(Math.random()*data.length-1);
    return num;
}