define(function(require, exports){
    var storage,
        _ = require('../vendor/lodash'),
        storageKey = "ext_injectcss";

    function init(){
        storage = JSON.parse(localStorage.getItem(storageKey) || '[]');
    }

    function set(st){
        storage = st;
        save();
    }

    function get(){
        return storage;
    }

    function save(){
        localStorage.setItem(storageKey, JSON.stringify(storage));
    }

    init();

    exports.set = set;
    exports.get = get;
});
