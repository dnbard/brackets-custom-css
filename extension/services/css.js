define(function(require, exports, module){
    var ExtensionUtils = brackets.getModule('utils/ExtensionUtils');

    exports.add = function(path){
        if (typeof path !== 'string' || path.length === 0){
            throw new Error('Invalid argument');
        }

        ExtensionUtils.loadStyleSheet(module, path);
    }

    exports.remove = function(path){
        if (typeof path !== 'string' || path.length === 0){
            throw new Error('Invalid argument');
        }

        $('link[href*="' + path + '"]').remove();
    }
});
