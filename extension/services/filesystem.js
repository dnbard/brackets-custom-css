var fs = require("fileSystemImpl");

define(function(require, exports){
    var q = require('../vendor/q');

    exports.writeFile = function(path, data, options){
        var defer = q.defer();

        fs.writeFile(path, data, options, function(err){
            if (err){
                defer.reject(err);
            } else {
                defer.resolve();
            }
        });

        return defer.promise;
    }
});
