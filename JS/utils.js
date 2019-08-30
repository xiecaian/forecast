/*事件监听函数*/
;(function(){
	function addEvent(el,type,fn){
		if(addEventListener){
			el.addEventListener(type,fn,false);
		}
		else if(el.attachEvent){
			el.attachEvent('on' + type,function(){
				fn.call(el);/*attachEvent默认是指向window，需要改*/
			});
		}
		else{
			el['on'+type] = fn;
		}
	}
	window.addEvent = addEvent;
})();

/*取消事件监听函数 */
;(function(){
	function removeEvent(el,type,fn){
		if(el.addEventListener){
			el.removeEventListener(type,fn,false);
		}
		else if(el.attachEvent){
			el.detachEvent('on' +type,fn);
		}
		else{
			el['on'+'type'] = null;
		}
	}
	window.removeEvent = removeEvent;
})();

/*禁止冒泡事件的发生 */
;(function(){
	function cancelBubble(e){
		var e = e || window.event;
		if(e.stoppropagation){
			e.stoppropagation();
		}
		else{
			e.cancelBubble = true;
		}
	}
	window.cancelBubble = cancelBubble;
})();
/*取消默认事件 */
;(function(){
	function stopDefault(e){
		var e = e || window.event;
		if(e.preventDefault){
			e.preventDefault();
		}else{
			e.returnValue = false;
		}

	}
	window.stopDefault = stopDefault;
})();
/*窗口滚动距离*/
;(function(){
	function scrollDistances(){
		if('number' === typeof(window.pageXOffset)){
			return {
				Left:window.pageXOffset,
				Top:window.pageYOffset
			}
		}
		else{
			return{
				Left:document.body.scrollLeft + document.documentElement.scrollLeft,
				Top :document.body.sceollTop + document.documentElement.scrollTop
			}
		}
	}
    window.scrollDistances = scrollDistances;
    
})();

/*窗口可视宽度高度*/
;(function(){
	function window_visible_range(){
		if('number' === typeof(window.innerWidth)){
			return{
				Left : window.innerWidth,
				Top : window.innerHeight
			}
		}
		else{
			if('BackCompat' === document.compatMode){
				/*怪异模式  compat :兼容*/
				return{
					Left : document.body.clientWidth,
					Top  : document.body.clientHeight
				}
				
			}
			else{
				return{
					Left : document.documentElement.clientWidth,
					Top  : document.documentElement.clientHeight
				}
			}
		}
	}
	window.window_visible_range = window_visible_range;
})();

/*页面总高度宽度*/
;(function(){
	function pageRange(){
		if('number' === typeof(document.documentElement.scrollHeight)){
			return{
				Left : document.documentElement.scrollWidth,
				Top	 : document.documentElement.scrollHeight
			}
		}
		else{
			return{
				Left : document.body.scrollWidth,
				Top  : document.body.scrollHeight
			}
		}
	}
	window.pageRange = pageRange;
})();

/* 获取相应的元素的属性值*/
;(function(){
    function getStyle(Elem,prop){
        if(window.getComputedStyle){
           if(prop){
            return(parseInt(window.getComputedStyle(Elem,null)[prop]));
           }
           else{
            return(window.getComputedStyle(Elem,null));
           }
            
        }
        else{
            return(Elem.currentStyle);
        }
    }
    window.getStyle = getStyle;
})();

/* 获取鼠标到文档的坐标点*/
;(function(){
    function getPagePos(e){
        
        var e = e || window.event,
            scrollLeft = scrollDistances().Left,
            scrollTop = scrollDistances().Top,
            /*偏移量 */
            cLeft = document.documentElement.clientLeft || 0,
            cTop = document.documentElement.clientTop || 0 ;
        return{
            Left : e.clientX + scrollLeft- cLeft,
            Top : e.clientY + scrollTop - cTop
        }
    }
    window.getPagePos = getPagePos;

})();

/**获取当前元素的子元素节点 */
;(function(){
	var findElementChildNode = function(node){
		var childNodes = node.childNodes,
			childLen = childNodes.length,
			childNode,
			temp = {
				'length' : '0' , /** 后面的0要打‘’，要不然会不认为是长度*/
				'splice' : Array.prototype.splice,
				'push' : Array.prototype.push
			};
		for(var i = 0 ; i < childLen; i++){
			
			childNode = childNodes[i];
			if(1 === childNode.nodeType){
				temp.push(childNode);
			}
		} 
		return temp;
	}
	window.findElementChildNode = findElementChildNode;
})();

/** 找到当前元素Elem的N级的父元素*/
;(function(){
	var findParents = function(ELem,N){
		if(N <= 0){
			return ;
		}
		if(N = 1 ){
			return ELem.parentNode;
		}
		else{
			return findParents(ELem,N-1);	
		}
	}
	window.findParents = findParents;
})();
/**判断一个点是否在一个三角形内
 * p:现在的值，判断该点在其他三点组成的三角形中
 * A: 三角形A点，
 * B: 三角形B点，
 * C: 三角形C点，
 * 在：返回true
*/
function vec(a,b){
	return {
		x:b.x - a.x,
		y:b.y - a.y
	}
}

function vecProduct(V1 ,V2){
	return V1.x * V2.y - V2.x * V1.y;
}

function sameSymbols(a,b){
	console.log('ab'+a+b);
	return (a ^b) >= 0;
}

function pointInTriangle(p,a,b,c){

	var PA = vec(p, a),
		PB = vec(p, b),
		PC = vec(p, c),
		R1 = vecProduct(PA, PB),
		R2 = vecProduct(PB, PC),
		R3 = vecProduct(PC, PA);
		return sameSymbols(R1, R2) && sameSymbols(R2, R3);

}