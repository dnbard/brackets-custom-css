define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        fs = require('../services/filesystem');
    
    function ModalViewModel(){
        this.sets = ko.observableArray([]);
        this.selectedSet = ko.observable();
        
        ModalViewModel.prototype.selectSet = _.bind(function(model, event){
            this.selectedSet(model);
        }, this);
    }
    
    ModalViewModel.prototype.addNewSet = function(model, event){
        this.sets.push({
            name: ko.observable('New Rule Set'),
            timestamp: new Date().toLocaleString(),
            type: 'local'
        });
        event.stopPropagation();
    }
    
    module.exports = ModalViewModel;
});
