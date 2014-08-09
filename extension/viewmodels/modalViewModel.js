define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        config = require('../config'),
        _ = require('../vendor/lodash'),
        fs = require('../services/filesystem'),
        guid = require('../services/guid'),
        cssCachePath = config.path + 'cache/';
    
    function ModalViewModel(){
        this.sets = ko.observableArray([]);
        this.selectedSet = ko.observable();
        
        ModalViewModel.prototype.selectSet = _.bind(function(model, event){
            this.selectedSet(model);
        }, this);
    }
    
    ModalViewModel.prototype.addNewSet = function(model, event){
        event.stopPropagation();

        var set = {
            name: ko.observable('New Rule Set'),
            timestamp: new Date().toLocaleString(),
            type: 'local',
            id: guid.generate()
        };

        this.sets.push(set);

        fs.writeFile(cssCachePath + set.id + '.css', '', {});
    }
    
    module.exports = ModalViewModel;
});
