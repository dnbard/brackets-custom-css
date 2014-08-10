var fs = require("fileSystemImpl");

define(function(require, exports){
    var config = require('../config');

    exports.init = function(){
        fs.watchPath(config.path + 'cache', function(filename){
            debugger;
        });
    }
});
