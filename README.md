# jWait

> a jquery plugin ,which provide a easy way to delay your work

> jquery(zepto)插件,把各种延迟串联起来,采用管道式写法  ----为了少写几个setTimeout,哈哈 

## 示例代码



**原来**

~~~ javascript
    setTimeout(function (){
        $('#b_1').addClass('active');
    },1000);
~~~

**现在**

~~~ javascript
    $('#b_1').jWait(1000)
             .addClass('active');
~~~

----
**原来 yet**

~~~ javascript
    setTimeout(function (){
        $('#b_1').addClass('active');
        
        setTimeout(function (){
            $('#b_2').css({color:red});
        },1000);
    },1000);
~~~

**==> 现在 now**

~~~ javascript
    $('#b_1').jWait(1000)
             .addClass('active')
             .jWait(1000)
             .jWait('#b_2').css({color:red});
~~~

----
**原来 yet**

~~~ javascript
    function doSth(){
        //...
    }

    setTimeout(function (){
        $('#b_1').addClass('active');
        doSth();
        setTimeout(function (){
            doSth();
            $('#b_2').css({color:red});
        },1000);
    },1000);
~~~

**==> 现在 now**

~~~ javascript
    function doSth(){
        //...
    }   
    
    $('#b_1').jWait(1000)
             .addClass('active')
             .jWait(doSth)
             .jWait(1000)
             .jWait(doSth)
             .jWait('#b_2').css({color:red});
~~~

----




## 参数
~~~ javascript
/**
 *
 * @param waitObj  绑定对象可以是 (数字,字符串,对象,方法)
 * 1.数字 表示延迟的时间(单位:毫秒)
 * 2.字符串 查询字符串querySelector,表示切换代理的对象为查询字符串代表的jquery对象
 * 3.对象 代理的对象,表示切换代理的对象
 * 4.方法 延迟后执行的函数,如果没有延迟,则直接执行
 *
 * @param callback 回调方法,只有当waitObj是数字类型时有效
 * @returns {jWaitProxy} 返回一个执行代理对象,一个神奇的对象
 */
$.fn.jWait = function (waitObj, callback) {
//....
}
~~~


 
 
