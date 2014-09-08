define(function (require, exports, module) {
    var ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        iconService = require('./services/icon'),
        modalService = require('./services/modal');
    
    require('./bindings/editableText');

    ExtensionUtils.loadStyleSheet(module, 'styles/main.css');
    ExtensionUtils.loadStyleSheet(module, 'http://cdn.jsdelivr.net/fontawesome/4.2.0/css/font-awesome.min.css');

    iconService.init();
    iconService.click(modalService.showHandler);

    require('./services/initializer').init();
    require('./services/onlineTracking').init();
});
