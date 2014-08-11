define(function(require, exports, module){
    var config = require('../config'),
        icon = null;
    
    function init(){
        var imagePath = config.path + 'images/icon.png';
        
        icon = $('<a id="css-inject_icon" class="fa fa-css3"></a>');
        icon.appendTo($("#main-toolbar .buttons"));
    }
    
    function click(handler){
        if (icon === null){
            throw new Error('Icon is not initialized');
        }
        
        icon.on('click', function(event){
            $(event.target).attr('active', 'true');
            handler(event);
        });
    }

    function reset(){
        icon.attr('active', 'false');
    }
    
    exports.init = init;
    exports.click = click;
    exports.reset = reset;
});
