var App = function(value) {
    /*需要初始化的值--------------------------*/
    /*------是否需要循环*/
    var loop = value.loop || false;
    var isScale = value.scale || false;
    var StyleArr = value.styleArr || false;
    var ImgArr = value.imgArr || false;
    var bgIMG = value.bgArr || false;
    var loadText = value.loadText || false;
    var mainDom = value.main || false;
    /*4 单页面构造函数*/
    var MakeDiv = function(className) {
            var div = '<div class="' + className + '"></div>';
            return div;
        }
        /*不需要配置的*/
        /*一屏高度*/
    var HEIGHT = document.body.clientHeight;
    //页面数量：从0算起
    var MaxPage = bgIMG.length - 1;
    /*移动阙值,松手之后的滑动时间,起始y点，和移动中的y*/
    var Thres = 150
    var endTime = 300
    var startY = 0,
        moveY = 0
        //当前三个screen的dom元，0为当前页，1为下一页，2为上一页
    var screenDom = [null, null, null]
        //当前三个dom装载的页面序号
    var screenPage = [0, 1, MaxPage]
        /*检测是否在单页面使用点击事件，如果move则无法使用*/
    var canClick = false;

    //开始函数
    this.start = function() {
            if (!StyleArr) {
                alert("当前没有配置页面样式数组！！！");
                return;
            }
            if (!ImgArr) {
                alert("当前没有配置预加载图片数组！！！");
                return;
            }
            if (!bgIMG) {
                alert("当前没有配置背景图片数组！！！");
                return;
            }
            if (!mainDom) {
                alert("当前没有配置主要的dom组件！！！");
                return;
            }
            stopDEF();
            preLoad(ImgArr, loadText, LoadOver);
        }
        //MakeDiv 改写
    this.changeMD = function(func) {
            MakeDiv = func;
        }
        //初始化配置
    this.Init = function(l, scale) {
            loop = l
            isScale = scale
        }
        /*0-0 禁止整个文档流的默认触摸事件*/
    var stopDEF = function() {
            /*禁止默认的事件*/
            function stopScrolling(touchEvent) {
                touchEvent.preventDefault();
            }
            document.addEventListener('touchstart', function() {
                stopScrolling
            }, false);
            document.addEventListener('touchmove', function() {
                stopScrolling
            }, false);
            document.addEventListener('touchend', function() {
                stopScrolling
            }, false);
            document.addEventListener('touchcancel', function() {
                stopScrolling
            }, false);
        }
        //0-1 开始触摸的函数：主要记录开始位置，和把能否点击的值变成true
    var mainTouchStart = function(evt) {
            evt.preventDefault();
            var touches = evt.touches || evt.originalEvent.touches;
            var touch = touches[0];
            startY = touch.pageY;
            canClick = true;
            startControl();
        }
        //0-2 手指移动的时候的函数：主要记录和开始位置的偏差值，和把能否点击的值变成false ->接着执行 1-2
    var mainTouchMove = function(evt) {
            evt.preventDefault();
            var touches = evt.touches || evt.originalEvent.touches;
            var touch = touches[0];
            moveY = touch.pageY - startY;
            canClick = false;
            moveControl();
        }
        //0-3 手指松开之后的操作: 执行1-3 之后再把startY/moveY复0
    var mainTouchEnd = function(evt) {
            evt.preventDefault();
            endControl();
            startY = 0;
            moveY = 0;
        }
        //1-1 0-1内部执行函数，弃用
    var startControl = function() {}
        /*
        	1-2:0-2内部执行函数，判断上moveY的值，
        	大于0->当前页下去，上一页下来
        	小于0->当前页上去，下一页上来
        	(
        		需要注意：由于此时在缩放的，所以上一页的中心点需要放在最下面，下一页的中心点需要放在最上面
        		而当前页则根据moveY变化而变化，所以大于0 则放在最上面，小于0就放在最下面
        	)
        */
    var moveControl = function() {
            if (moveY > HEIGHT || moveY < -HEIGHT) {
                return;
            }
            //计算缩放比例
            var scaleBL = Math.abs(moveY / HEIGHT);
            //往下拉动，把上一页拉出来的情况
            if (moveY > 0) {
                if (loop) {
                    setSlide(screenDom[2], -HEIGHT + moveY, 0.5 + scaleBL * 0.5, 0, false);
                } else {
                    if (screenPage[0] != 0) {
                        setSlide(screenDom[2], -HEIGHT + moveY, 0.5 + scaleBL * 0.5, 0, false);
                    }
                }
                setSlide(screenDom[0], moveY, 1 - scaleBL * 0.5, 0, true);
            }
            //往上拉动，把下一页拉出来的情况
            if (moveY < 0) {
                if (loop) {
                    setSlide(screenDom[1], HEIGHT + moveY, 0.5 + scaleBL * 0.5, 0, true);
                } else {
                    if (screenPage[0] != MaxPage) {
                        setSlide(screenDom[1], HEIGHT + moveY, 0.5 + scaleBL * 0.5, 0, true);
                    }
                }
                setSlide(screenDom[0], moveY, 1 - scaleBL * 0.5, 0, false);
            }
        }
        /*
        	1-3：0-3内部执行函数，
        	大于0->有没有大于阙值Thres ，大于就执行：上一页下来，当前页下去的动画之后再执行1-4，没有就执行复位动画
        	小于0->有没有小于阙值-Thres ，大于就执行：上一页下来，当前页下去的动画之后再执行1-4，没有就执行复位动画
        */
    var endControl = function() {
            //往下拉动，把上一页拉出来的情况
            if (moveY > 0) {
                if (!loop && screenPage[0] == 0) {
                    setSlide(screenDom[0], 0, 1, endTime, true);
                    return;
                }
                if (moveY > Thres) {
                    setSlide(screenDom[0], HEIGHT, 0.5, endTime, true);
                    setSlide(screenDom[2], 0, 1, endTime);
                    AfterEnd(1);
                } else {
                    setSlide(screenDom[0], 0, 1, endTime, true);
                    setSlide(screenDom[2], -HEIGHT, 0.5, endTime);
                }
            }
            //往上拉动，把下一页拉出来的情况
            if (moveY < 0) {
                if (!loop && screenPage[0] == MaxPage) {
                    setSlide(screenDom[0], 0, 1, endTime, true);
                    return;
                }
                if (moveY < -Thres) {
                    setSlide(screenDom[0], -HEIGHT, 0.5, endTime, false);
                    setSlide(screenDom[1], 0, 1, endTime, true);
                    AfterEnd(-1);
                } else {
                    setSlide(screenDom[0], 0, 1, endTime);
                    setSlide(screenDom[1], HEIGHT, 0.5, endTime, true);
                }
            }
        }
        /*
        	1-4: 1-3的后续函数，传参i为上划 / 下划的区别
        		i > 0 下拉：上一页变成当前页，当前页变成下一页，原来的下一页变成上一页。page -- 到0则为max
        		i < 0 上拉：下一页变成当前页，当前页变成上一页，原来的上一页变成下一页。page ++ 到max则为0
        		上面的废话就是说：由于原来规定了screenDom[]的0代表当前页，1代表下一页，2代表上一页，
        		变来变去的做法就是把0，1，2对应的dom互换一下。
        		而page的作用是用来记录整体的进度，0~max.
        		原来的上下页变化则为改变背景图
        		由于当前页和上下页变化的endtime是300ms 所以在300ms之后执行当前页的元素写入
        */
    var AfterEnd = function(i) {
            //往下拉动，把上一页拉出来的情况
            if (i > 0) {
                var dom1 = screenDom[0];
                var dom2 = screenDom[1];
                var domP1 = screenPage[0];
                var domP2 = screenPage[2];
                //dom引用变动
                screenDom[0] = screenDom[2];
                screenDom[1] = dom1;
                screenDom[2] = dom2; //这个本来是下一页，但现在要变成上一页
                //page变动
                screenPage[0] = domP2;
                screenPage[1] = domP1;
                if (domP2 == 0) {
                    screenPage[2] = MaxPage
                } else {
                    screenPage[2] = domP2 - 1;
                }
                /*改变背景*/
                dynBg(screenDom[2], screenPage[2], 'jpg');
            } else {
                var dom1 = screenDom[0];
                var dom2 = screenDom[2];
                var domP1 = screenPage[0];
                var domP2 = screenPage[1];
                //dom引用变动
                screenDom[0] = screenDom[1];
                screenDom[1] = dom2; //这个本来是上一页，但现在要变成下一页
                screenDom[2] = dom1;
                //page变动
                screenPage[0] = domP2;
                screenPage[2] = domP1;
                if (domP2 == MaxPage) {
                    screenPage[1] = 0;
                } else {
                    screenPage[1] = domP2 + 1;
                }
                /*改变背景*/
                dynBg(screenDom[1], screenPage[1], 'jpg');
            }
            setTimeout(WriteEle, 300);
        }
        /*
        	1-5：当前页screen的元素写入函数，
        	传参为true则为第一次执行，不需要把其他两个screen的清零的操作
        */
    var WriteEle = function(first) {
            var current = screenPage[0]
            var currentDom = screenDom[0]
            var currentStyle = StyleArr[current]
            var domString = '';
            for (var i = 0; i < currentStyle.length; i++) {
                domString = domString + MakeDiv(currentStyle[i]);
            }
            currentDom.innerHTML = domString;
            if (!first) {
                screenDom[1].innerHTML = '';
                screenDom[2].innerHTML = '';
            }
        }
        /*
        	2-0 dom查找classname元素操作
        	根据name和i寻找对应的className的节点，
        	如果不填i则返回整个数组，
        	但如果数组只有一个元素就仅返回这个元素
        */
    var getEle = function(name, i) {
            var index = 0;
            if (i) {
                index = i
            }
            var l = document.getElementsByClassName(name);
            if (l.length > 1) {
                return l
            } else {
                return l[0]
            }
        }
        /*
        	2-1 dom 样式操作
        	动态改变元素背景图，
        */
    var dynBg = function(dom, name, type) {
            if (bgIMG[name] != '') {
                dom.style.backgroundImage = "url(" + php.root + bgIMG[name] + ")";
            }
        }
        /*
        	2-2 dom 样式操作
        	设置dom元素的y位置和缩放大小，
        	t为时间
        	isTop 为是否把中点设置为顶点
         */
    var setSlide = function(that, y, s, t, isTop) {
            //页面间不同特效主要改这里
            if (isScale) {
                that.style.webkitTransform = "translateY(" + y + "px) scale(" + s + ")"
                that.style.webkitTransitionDuration = t + 'ms'
                if (isTop) {
                    that.style.webkitTransformOrigin = '50% 0%'
                } else {
                    that.style.webkitTransformOrigin = '50% 100%'
                }
            } else {
                that.style.webkitTransform = "translateY(" + y + "px)"
                that.style.webkitTransitionDuration = t + 'ms'
            }
        }
        /*3-0 dom元素绑定操作*/
    var AddTouch = function() {
            main.addEventListener('touchstart', mainTouchStart);
            main.addEventListener('touchmove', mainTouchMove);
            main.addEventListener('touchend', mainTouchEnd);
            /*PS:移动设备被打断时候执行，就如同正在执行touchmove操作的时候，来电了，这时候会按理说会执行的，不过实测不行*/
            main.addEventListener('touchcancel', mainTouchEnd);
        }
        /*4 预加载*/
    var preLoad = function(LoadIMG, loadText, over) {
            loadData(LoadIMG);

            function loadData(fisrtArr) {
                var picdata = new PicData();
                //必要图片添加
                function oneCom(curInd) {
                    var bl = Math.ceil((curInd + 1) / fisrtArr.length * 100) + "%";
                    if (loadText != false) {
                        loadText.innerHTML = bl;
                    }
                    if (curInd >= fisrtArr.length - 1) {
                        over();
                    }
                }
                picdata.loadPicArr(fisrtArr, oneCom);
            }

            function PicData() {
                var overCall = function() {};
                var curInd = 0;
                var picUrlArr = new Array();
                this.loadPicArr = function(arr, oneCom) {
                    picUrlArr = arr;
                    if (oneCom) {
                        cbFunc_oneCom = oneCom;
                    }
                    loadPicOne(picUrlArr[curInd]);
                };
                /*加载图片*/
                function loadPicOne(url) {
                    var img = new Image();
                    img.onload = loadHandler;
                    img.src = php.root + url;
                }
                /*加载完一张图片后的回调函数*/
                function loadHandler() {
                    cbFunc_oneCom(curInd);
                    curInd++;
                    if (curInd < picUrlArr.length) {
                        loadPicOne(picUrlArr[curInd])
                    } else {
                        overCall();
                    }
                }
            }
        }
        /*6 预加载成功之后的函数*/
    var LoadOver = function() {
        var main = mainDom;
        //装载dom节点的screen
        var screen = null;
        var domString = "";
        for (var i = 0; i < 3; i++) {
            domString = domString + MakeDiv('screen');
        }
        main.innerHTML = domString;
        screen = getEle('screen');
        for (var i = 0; i < screen.length; i++) {
            if (i != 0) {
                setSlide(screen[i], HEIGHT, 0.5, 0, true);
            }
            screenDom[i] = screen[i];
            dynBg(screen[i], screenPage[i], 'jpg');
        }
        WriteEle(true);
        AddTouch();
    }
}
