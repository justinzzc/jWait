/**
 * Created by zhouzechen on 16/11/24.
 */
(function ($) {
    /**
     *
     *
     * @param targetObj 代理对象
     * @param preActions 上一个小伙伴留下没有执行完的队列
     */
    function jWaitProxy(targetObj, preActions) {
        var mProxy = this;
        var __original = targetObj;

        this.__id = Math.floor(Math.random() * 20000) + '_' + new Date().getTime();
        this.getOriginal=function(){
            return __original;
        };



        var actionDoing = false;
        var aniQueue = preActions || [];

        function addMethodCallToQueue(methodName, args) {
            //console.log('[' + mProxy.__id + ']@add== addToQueue: methodName:[' + methodName + ']');
            aniQueue.push([methodName, args]);
            return doNext();
        }

        var lastResult;



        function getAction(ops, cb) {
            var tp = (typeof ops);
            switch (tp) {
                case 'number':
                    return function () {
                        setTimeout(function () {
                            cb && cb();
                            actionDoing = false;
                            doNext();
                        }, ops);
                    };
                    break;
                case 'function':
                    return function () {
                        lastResult = ops.bind(mProxy.getOriginal())({
                            lastResult:lastResult,
                            currentProxy:mProxy
                        },stopRun);

                        actionDoing = false;
                        doNext();
                    };
                    break;
                case 'string':
                    appendMethodProxy($(ops));
                    return function () {
                        mProxy = new jWaitProxy($(ops), aniQueue);
                    };
                    break;
                case 'object':
                    appendMethodProxy(ops);
                    return function () {
                        mProxy = new jWaitProxy(ops, aniQueue);
                    };
                    break;
                default :
                    return function () {
                        doNext();
                        return mProxy;
                    }.bind(mProxy);
                    break;
            }

        }


        function stopRun() {
            //clear queue
            aniQueue = [];
        }

        function doNext() {
            if (!actionDoing && aniQueue.length) {
                actionDoing = true;
                var act = aniQueue.shift();
                var act_type = Object.prototype.toString.call(act);
                switch (act_type) {
                    case '[object Array]'://method call
                        getAction(function () {
                            var methodName = act[0], args = act[1];
                            //console.log('do method['+methodName+'] start');
                            //console.log('[' + mProxy.__id + ']@ing== action: methodName:[' + methodName + '] args:' + args);
                            return mProxy.getOriginal()[methodName].apply(mProxy.getOriginal(), Array.prototype.slice.call(args));
                            //console.log('do method['+methodName+'] end');
                        })();
                        break;
                    case '[object Function]'://default function
                        act();
                        break;
                    default :
                        doNext();
                        break;
                }
            }
            return mProxy;
        }

        function addAction(ops, cb) {

            var action = getAction(ops, cb);
            aniQueue.push(action);
            doNext();
        }

        function initMethod(dest, k) {
            dest[k] = function () {
                addMethodCallToQueue(k, arguments);
                return mProxy;
            }
        }

        function appendMethodProxy(obj) {
            for (var k in obj) {
                if (typeof  obj[k] === 'function') {
                    if (k != 'jWait' && k != 'constructor') {
                        initMethod(mProxy, k);
                    }
                }
            }

            mProxy.jWait = function (ops) {
                addAction.apply(obj, Array.prototype.slice.call(arguments));
                return mProxy;
            };
        }

        function init() {

            appendMethodProxy(targetObj);

            doNext();
        }

        init();

    }

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

        var me = this || {};

        var proxy = new jWaitProxy(me);

        proxy.jWait(waitObj, callback);

        return proxy;
    };

    $.jWait = function (waitObj, callback) {

        var proxy = new jWaitProxy({});

        proxy.jWait(waitObj, callback);

        return proxy;
    }

})(jQuery);
