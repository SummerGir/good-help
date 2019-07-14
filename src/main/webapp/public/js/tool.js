//==============判断一个对象是否是函数===============//
function isFunction( fn ) {
	 return  !!fn && !fn.nodeName && fn.constructor != String &&
	  fn.constructor != RegExp && fn.constructor != Array &&
	  /function/i.test( fn + "" );
}
//===========================================//