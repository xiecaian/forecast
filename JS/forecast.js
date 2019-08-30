window.onload = function(){
    init();
}
function init(){
    forecastInit(document.getElementsByClassName('wrap')[0]);
}

var forecastInit = (function(){
    var Config,
        OWrap,
        OListItems,
        OImgWrap,
        OImgItems,
        t,
        toDelay = 0,
        lastpos,
        curpos,
        mousePoses = [],
        isInSub = 0;
    function getConfig(elem){
        return JSON.parse(elem.getAttribute('data-config'));
    }
    function setConfig(elem){
        console.log(elem);
        OWrap = document.getElementsByClassName(elem.wrap)[0];
        OListItems = document.getElementsByClassName(elem.listItem);
        OImgItems = document.getElementsByClassName(elem.listImg);
        OImgWrap = document.getElementsByClassName(elem.imgWrap)[0];/**作为子元素移入移除事件的 */
    }
    function bindEvent(){
        addEvent(OWrap,'mouseenter',showEvent);
        addEvent(OWrap,'mouseleave',hideEvent);
        addEvent(OImgWrap,'mouseenter',function(){
            isInSub = 1;
        })
        addEvent(OImgWrap,'mouseleave',function(){
            isInSub = 0;
        })
    }
    function hideEvent(){
        removeAllActive();
        removeEvent(OWrap,'mouseenter',showEvent);
        removeEvent(document,'mousemove',mouseMove);
    }
    function showEvent(){
        var OItem,
            OListLen = OListItems.length;
            for(var i = 0; i < OListLen;i++){
                OItem = OListItems[i];
                addEvent(OItem,'mouseenter',listMouseEnter);
            }
    }
    function mouseMove(e){
        const lastposIdx = 0,
              curposIdx = 1;    
        var e = e || window.event,
        tar = e.target || e.srcElement;
        mousePoses.push({
            x: getPagePos(e).Left,
            y: getPagePos(e).Top
        });
        if(mousePoses.length >= 3){
            mousePoses.shift();/**删除第一个 */ 
        }
        /**有一个问题，当是沿着三角形的边移动没有用吗？ */
        lastpos = mousePoses[lastposIdx] || {x:0,y:0};
        curpos = mousePoses[curposIdx] || {x:0,y:0};
        toDelay = toSetTimeOut(curpos,lastpos);/** 判断是否需要进入延时，这个就是鼠标行为预测，当为真则*/
    }
    function toSetTimeOut(curpos,lastpos){
        var topPos = {
            /**获取上顶点的坐标 */
            x : getStyle(OImgWrap,'left'),
            y : getStyle(OImgWrap,'top')
        },
        bottomPos = {
             /**获取下顶点的坐标 */
            x : getStyle(OImgWrap,'left'),
            y : getStyle(OImgWrap,'top') + getStyle(OImgWrap,'height')
        };
        return pointInTriangle(curpos,lastpos,topPos,bottomPos);/* 注意，其坐标要是x，y */

    }
    function listMouseEnter(e){
        addEvent(document,'mousemove',mouseMove);/** 进入后加鼠标移动事件，去获取现在的坐标点后上一个坐标点*/
        var e = e || window.event,
            tar = e.target || e.srcElement,
            CurIdx = Array.prototype.indexOf.call(OListItems,tar);
          if(t){
            clearTimeout(t);
          } 
          if(toDelay){
              /** 真，代表是正在往子元素靠，要延时*/
              t = setTimeout(function(){
                /** 加入延时，可以有充足的时间判断是否进入子项
                 * 如果加入了子项就直接返回，不做任何动作，等下次再进入再重新判断
                 * 如果没有进入到子项就延时让其晚点显示，这样的好处是防止想进入子项中去找相应的值时而不小心滑到其他的项而干扰
                 * 但是此时想进入其他项会有延时，不好
                */
            
              if(isInSub){
                  return;
              }
              addActive(CurIdx);
            },300);
          }else{
              /**不需要延时，直接设置 */
              t = setTimeout(function(){
                addActive(CurIdx);
              },100);
          }
    }
    function addActive(num){
        removeAllActive();
        OImgItems[num].className += ' active';

    } 
    function removeAllActive(){
        var OItem,
            OImg,
            OListLen = OListItems.length,
            OImgLen = OImgItems.length;
        for(var i = 0; i < OListLen; i++){
            OItem = OListItems[i];
            OItem.className = 'list-item';
        }
        for(var i = 0; i < OImgLen; i++){
            OImg = OImgItems[i];
            OImg.className = 'list-img';
        }
    }
    function init(node){
        Config = getConfig(node);
        setConfig(Config);
        bindEvent();
    }
    return init;
})();