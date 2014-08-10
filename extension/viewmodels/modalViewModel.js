var DocumentManager = require('document/DocumentManager');

define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        config = require('../config'),
        _ = require('../vendor/lodash'),
        fs = require('../services/filesystem'),
        guid = require('../services/guid'),
        cssCachePath = config.path + 'cache/';
    
    function ModalViewModel(dialog){
        var self = this;

        this.sets = ko.observableArray([]);
        this.selectedSet = ko.observable();
        this.dialog = dialog;

        this.openDocument = function(model){
            DocumentManager.getDocumentForPath(cssCachePath + model.id + '.css')
                .done(_.bind(function(document){
                    DocumentManager.setCurrentDocument(document);
                    this.close();
                }, self));
        }
        
        this.remove = function(set){
            fs.moveToTrash(cssCachePath + set.id + '.css')
                .then(function(){
                    self.sets.remove(set);
                });
        }
    }

    ModalViewModel.prototype.iconType = function(){
        return 'url(' + config.path + 'images/css-big.png)';
    }

    ModalViewModel.prototype.close = function(){
        this.dialog.remove();
        $('.modal-wrapper').remove();
    }
    
    ModalViewModel.prototype.addNewSet = function(model, event){
        event.stopPropagation();

        var set = {
            name: ko.observable('New CSS'),
            timestamp: new Date().toLocaleString(),
            type: 'local',
            id: guid.generate()
        };

        this.sets.push(set);

        fs.writeFile(cssCachePath + set.id + '.css', '', {});
    }
    
    module.exports = ModalViewModel;
});
