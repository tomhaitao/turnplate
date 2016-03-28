/**
 * Created by zht on 2015/6/24.
 */
var turnplate={
    restaraunts:[],				//大转盘奖品名称
    colors:[],					//大转盘奖品区块对应背景颜色
    outsideRadius:192,			//大转盘外圆的半径
    textRadius:155,				//大转盘奖品位置距离圆心的距离
    insideRadius:68,			//大转盘内圆的半径
    startAngle:0,				//开始角度

    bRotate:false				//false:停止;ture:旋转
};

function getN(s){
    return s.replace(/[^0-9]/ig,"");
}
$(document).ready(function(){
    $(".directionP").css('bottom',$("#startGame").height()+80+15);//设置提示信息的位置

    /*$("#directionBtn").bind("click",function(){
        $(".directionDiv").toggle();
    });*/

    $("#startGame").bind("click",function(){
        $("#home").hide();
        $("#startPage").show();
        enterStarPage();
        $("#topnav").accordion({
            accordion:false,
            speed: 500,
            closedSign: '[+]',
            openedSign: '[-]'
        });
    })
    //动态添加大转盘的奖品与奖品区域背景颜色
//	turnplate.restaraunts = ["50M免费流量包", "10闪币", "谢谢参与", "5闪币", "10M免费流量包", "20M免费流量包", "20闪币 ", "30M免费流量包", "100M免费流量包", "2闪币"];
//	turnplate.colors = ["#FFF4D6", "#FFFFFF", "#FFF4D6", "#FFFFFF","#FFF4D6", "#FFFFFF", "#FFF4D6", "#FFFFFF","#FFF4D6", "#FFFFFF"];


    /*var rotateTimeOut = function (){
     $('#wheelcanvas').rotate({
     angle:0,
     animateTo:2160,
     duration:8000,
     callback:function (){
     alert('网络超时，请检查您的网络设置！');
     }
     });
     };*/
});
//选择餐厅页面
function enterStarPage(){
    $("ul.topnav li ul li a").bind("click",function(){
        var txt;
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            var len = turnplate.restaraunts.length;
            for(var i=0; i<len; i++){
                if(turnplate.restaraunts[i] == this.text){
                    turnplate.restaraunts.splice(i,1);
                    i--;
                }
            }
            if(len == 1){
                $(".titleDiv textarea").text("请选择餐厅");
                $("#count").val("转n次");
                $(".minus").css('background-color','#999999');
                $(".inputNum").css('color','#999999');
                $(".plus").css('background-color','#999999');
                $(".startBtn").css('background-color','#999999');
                $(".minus").off("click");
                $(".plus").off("click");
            }
            else{
                txt = turnplate.restaraunts.join("、");
                $(".titleDiv textarea").text("已选餐厅"+(len-1)+"家:"+"\n"+txt);
                $("#count").val("转"+(len-1)+"次");
            }
            console.log(turnplate.restaraunts);
        }else{
            $(this).addClass('selected');
            turnplate.restaraunts.push(this.text);
            txt = turnplate.restaraunts.join("、");
            $(".titleDiv textarea").text("已选餐厅"+turnplate.restaraunts.length+"家:"+"\n"+txt);
            $("#count").val("转"+turnplate.restaraunts.length+"次");
            $(".minus").css('background-color','#f05d25');
            $(".inputNum").css('color','#f05d25');
            $(".plus").css('background-color','#f05d25');
            $(".startBtn").css('background-color','#f05d25');

        }
    });

    $(".minus").bind("click",function(){
        var num = getN($("#count").val());
        num--;
        if(num < 0)num=0;
        $("#count").val("转"+num+"次");
    })
    $(".plus").bind("click",function(){
        var num = getN($("#count").val());
        num++;
        $("#count").val("转"+num+"次");
    })
    $("#starbtn").bind("click",startGame);
}

function startGame(){
    var value = getN($("#count").val());  //输入的游戏次数
   /* var liLength = $("ul.topnav li ul li a").length;
    for(var i = 0; i < liLength; i++){
        var aElement = $("ul.topnav li ul li a")[i];
        if($(aElement).hasClass('selected')){
            turnplate.restaraunts.push(aElement.innerHTML);
            if(i%2 == 0){
                turnplate.colors.push("#FFF4D6");
            }else{
                turnplate.colors.push("#FFFFFF");
            }
        }
    }*/
    for(var i=0; i<turnplate.restaraunts.length; i++){
        if(i%2 ==0){
            turnplate.colors.push("#67cfe3");
        }else{
            turnplate.colors.push("#4ec1e0");
        }
    }
    if(value == 0 || turnplate.restaraunts.length==0){
        alert("请选择餐厅");
    }else{
        /*console.log(value+"-----"+turnplate.restaraunts.length);
        if(value > turnplate.restaraunts.length){*/
        $("#startPage").hide();
        $(".banner").show();
        enterStage();
        /*}else{
            turnplate.restaraunts = [];
            alert("输入的游戏次数必须大于所选餐厅的个数");
        }*/
    }
}

function enterStage(){
    console.log("enterStage");
    drawRouletteWheel();
    var num = 0;
    $('.pointer').click(function (){
        if(turnplate.bRotate)return;
        turnplate.bRotate = !turnplate.bRotate;
        console.log(num+"----"+getN($("#count").val()));
        if(num < getN($("#count").val())){
            //获取随机数(奖品个数范围内)
            var item = rnd(1,turnplate.restaraunts.length);
            //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
            rotateFn(item, turnplate.restaraunts[item-1]);
            //console.log(item);
        }else{
            /*var nameArr = array[0].split(":");
            overGame(nameArr);*/
            //turnplate.restaraunts = ["hahah","woueroe"];
            //turnplate.colors = [];
            //drawRouletteWheel();
            //console.log(turnplate.restaraunts);

            if(array.length>1){
                judgeResult();
            }else{
                var nameArr = array[0].split(":");
                overGame(nameArr[0]);
            }
        }
        num++;
    });
}
//判断结果中是否有次数相同的餐厅
function judgeResult(){
    $('.pointer').off();
    var resultArr = [];
    var firstName = array[0].split(":")[0];
    var firstValue = array[0].split(":")[1];
    resultArr.push(firstName);
    for(var i=1; i<array.length; i++){
        var secondName = array[i].split(":")[0];
        var secondValue = array[i].split(":")[1];
        if(secondValue == firstValue){
            resultArr.push(secondName);
        }
    }
    if(resultArr.length>1){
        turnplate.restaraunts = resultArr;
        turnplate.bRotate = !turnplate.bRotate;
        $(".judgeDiv").show();
        $("#restart").click(function(){
            array= [];
            arr = [];
            enterStage();
            $(".judgeDiv").hide();
            $("#resultText").text("");
            $("#count").val("转1次");

        })
    }else{//结果中没有次数相同的餐厅
        overGame(resultArr[0]);
    }

}
//旋转转盘 item:奖品位置; txt：提示语;
var array = [];
var rotateFn = function (item, txt){
    var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
    if(angles<270){
        angles = 270 - angles;
    }else{
        angles = 360 - angles + 270;
    }
    $('#wheelcanvas').stopRotate();
    $('#wheelcanvas').rotate({
        angle:0,
        animateTo:angles+1800,
        duration:8000,
        callback:function (){
            /*var oldValue = $("#resultText").val();
             var value = txt+":1";
             $("#resultText").text(oldValue+"\n"+value);*/
            turnplate.bRotate = !turnplate.bRotate;
            console.log(array);
            array = orderResult(txt);
            var text = array.join("\n");

            $("#resultText").text(text);
        }
    });
};
//游戏结束
function overGame(name){
    turnplate.restaraunts = [];
    turnplate.colors = [];
    $(".titleDiv textarea").text("请选择餐厅");
    $("#count").val("转n次");
    $(".minus").css('background-color','#999999');
    $(".inputNum").css('color','#999999');
    $(".plus").css('background-color','#999999');
    $(".startBtn").css('background-color','#999999');
    $(".minus").off("click");
    $(".plus").off("click");
    $("#starbtn").off("click");
    var liLength = $("ul.topnav li ul li a").length;
    for(var i = 0; i < liLength; i++){
        var aElement = $("ul.topnav li ul li a")[i];
        if($(aElement).hasClass('selected')){
            $(aElement).removeClass('selected');
        }
    }
    $("ul.topnav li ul li a").off("click");
    $('.pointer').off("click");
    turnplate.bRotate = !turnplate.bRotate;
    $("#resultText").text("");
    arr = [];
    $('.overPage').show();
    $(".banner").hide();
    $('.overPage .p2').text("");
    $('.overPage .p2').text($('.overPage .p2').text()+name);
    $('.btnRestart').bind('click',restartFun);
}

function restartFun(){
    $("#startPage").show();
    $('.overPage').hide();
    enterStarPage();
}

var arr = [];
function orderResult(txt){
    var value = txt+":1";
    var flag = false;
    if(arr.length>0){
        for(var i=0; i<arr.length; i++){
            var arr1 = arr[i].split(":");
            if(txt == arr1[0]){
                arr[i] = txt+":"+(Number(arr1[1])+1);
                flag = true;
            }
        }
    }
    arr.push(value);
    if(flag)arr.pop();
    for(var j=0; j<arr.length; j++){
        for(var k=0; k<arr.length-1; k++){
            var tempArr = arr[k].split(":");
            var tempArr1 = arr[k+1].split(":");
            if(Number(tempArr[1])<Number(tempArr1[1])){
                var temp = arr[k];
                arr[k] = arr[k+1];
                arr[k+1] = temp;
            }
        }
    }
    console.log(arr);
    return arr;
}

function rnd(n, m){
    var random = Math.floor(Math.random()*(m-n+1)+n);
    return random;

}


//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
window.onload=function(){
//	drawRouletteWheel();
};

function drawRouletteWheel() {
    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length/2);
        var ctx = canvas.getContext("2d");
        //在给定矩形内清空一个矩形
        ctx.clearRect(0,0,422,422);
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
        ctx.strokeStyle = "#FFBE04";
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '16px Microsoft YaHei';
        for(var i = 0; i < turnplate.restaraunts.length; i++) {
            var angle = turnplate.startAngle + i * arc;
            ctx.fillStyle = turnplate.colors[i];
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
            ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
            ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();

            //----绘制奖品开始----
            ctx.fillStyle = "#E5302F";
            var text = turnplate.restaraunts[i];
            var line_height = 17;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
            if(text.indexOf("M")>0){//流量包
                var texts = text.split("M");
                for(var j = 0; j<texts.length; j++){
                    ctx.font = j == 0?'bold 20px Microsoft YaHei':'16px Microsoft YaHei';
                    if(j == 0){
                        ctx.fillText(texts[j]+"M", -ctx.measureText(texts[j]+"M").width / 2, j * line_height);
                    }else{
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                    }
                }
            }else if(text.indexOf("M") == -1 && text.length>6){//奖品名称长度超过一定范围
                text = text.substring(0,6)+"||"+text.substring(6);
                var texts = text.split("||");
                for(var j = 0; j<texts.length; j++){
                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                }
            }else{
                //在画布上绘制填色的文本。文本的默认颜色是黑色
                //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            }

            //添加对应图标
            /*if(text.indexOf("闪币")>0){
             var img= document.getElementById("shan-img");
             img.onload=function(){
             ctx.drawImage(img,-15,10);
             };
             ctx.drawImage(img,-15,10);
             }else if(text.indexOf("谢谢参与")>=0){
             var img= document.getElementById("sorry-img");
             img.onload=function(){
             ctx.drawImage(img,-15,10);
             };
             ctx.drawImage(img,-15,10);
             }*/
            //把当前画布返回（调整）到上一个save()状态之前
            ctx.restore();
            //----绘制奖品结束----
        }
    }
}