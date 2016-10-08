window.onload = function() {
    /*初始需用用到的dom节，loadText不是必填的*/
    var main = document.getElementById('main');
    var loadText = document.getElementsByClassName('loadText');
    /*初始化需要用到的三个数组，样式class name，预加载图片，和背景图*/
    var StyleArr = [
        ["p1e1", "p1e2", "p1e3", "p1e4", "p1e5", "jian"],
    ];
    /*预加载数据*/
    var ImgArr = [
        'p1/e1.png',
        'p1/e2.png',
        'p1/e3.png',
        'p1/e4.png',
        'p1/e5.png',

        'p2/e1.png',
        'p2/e2.png',
        'p2/e3.png',
        'p2/e4.png',
        'p2/e5.png',
        'p2/e6.png',
        'p2/e7.png',
        'p2/e8.png',
        'p2/e9.png',

        'p3/e1.png',
        'p3/e2.png',
        'p3/e3.png',
        'p3/e4.png',

        'p4/e1.png',
        'p4/e2.png',
        'p4/e3.png',
        'p4/e4.png',
        'p4/e5.png',

        'p5/e1.png',
        'p5/e2.png',
        'p5/e3.png',
        'p5/e4.png',
        'p5/e5.png',
        'p5/e6.png',
        'p5/e7.png',
        'p5/e8.png',
        'p5/e9.png',

        'p6/e1.png',
        'p6/e2.png',
        'p6/e3.png',
        'p6/e4.png',
        'p6/e5.png',
        'p6/e6.png',
        'p6/e7.png',
        'p6/e8.png',

        'p7/e1.png',
        'p7/e2.png',
        'p7/e3.png',
        'p7/e4.png',
        'p7/e5.png',
        'p7/e6.png',
        'p7/e7.png',
        'p7/e8.png',

        'p8/e1.png',
        'p8/e2.png',
        'p8/e3.png',
        'p8/e4.png',
        'p8/e5.png',
        'p8/e6.png',

        'p9/e1.png',
        'p9/e2.png',
        'p9/e3.png',
        'p9/e4.png',
        'p9/e5.png',
        'p9/e6.png',
        'p9/e7.png',
        'p9/e8.png',
        'p9/e9.png',

        'px/e1.png',
        'px/e2.png',
        'px/e3.png',
        'px/e4.png',
        'px/e5.png',
        'px/e6.png',

        'p1/bg.jpg',
        'p3/bg.jpg',
        'p4/bg.jpg',
        'p6/bg.jpg',
        'p8/bg.jpg',
        'p9/bg.jpg',
        'jian.png'
    ];
    /*背景图片*/
    var bgIMG = [
        'p1/bg.jpg',
        '',
        'p3/bg.jpg',
        'p4/bg.jpg',
        '',
        'p6/bg.jpg',
        '',
        'p8/bg.jpg',
        'p9/bg.jpg',
        ''
    ];
    /*需要在页面内加元素事件则需要改写*/
    var MakeDiv = function(className) {}
        /*开始————————*/
    var app = new App({
        loop: true,
        scale: true,
        loadText: loadText,
        main: main,
        styleArr: StyleArr,
        imgArr: ImgArr,
        bgArr: bgIMG,
    });
    // app.changeMD(MakeDiv);
    app.start();
}
