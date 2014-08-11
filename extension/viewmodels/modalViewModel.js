var DocumentManager = require('document/DocumentManager');

define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        config = require('../config'),
        fs = require('../services/filesystem'),
        guid = require('../services/guid'),
        storage = require('../services/storage'),
        CSSStorageControl = require('../services/css'),
        initializer = require('../services/initializer'),
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
            var path = cssCachePath + set.id + '.css';
            fs.moveToTrash(path)
                .then(function(){
                    self.sets.remove(set);
                    initializer.remove(path);
                });
        }

        this.toggleActive = function(set){
            set.active(!set.active());

            var status = set.active(),
                path = cssCachePath + set.id + '.css';;

            if (status){
                initializer.add(path);
                CSSStorageControl.add(path);
            } else {
                initializer.remove(path);
                CSSStorageControl.remove(path);
            }
        }

        this.deserialize(storage.get());
    }

    ModalViewModel.prototype.iconType = function(){
        return 'url(' + config.path + 'images/css-big.png)';
    }

    ModalViewModel.prototype.close = function(){
        this.dialog.remove();
        $('.modal-wrapper').remove();

        storage.set(this.serialize());
    }

    ModalViewModel.prototype.serialize = function(){
        var result = [];
        _.each(this.sets(), function(set){
            var sSet = {};
            _.each(set, function(property, name){
                if (typeof property === 'function'){
                    sSet[name] = property();
                } else {
                    sSet[name] = property;
                }
            });

            result.push(sSet);
        });

        return result;
    }
    
    ModalViewModel.prototype.addNewSet = function(model, event){
        event.stopPropagation();

        var set = this.createSet({
            name: 'New CSS',
            timestamp: new Date().toLocaleString(),
            type: 'local',
            id: guid.generate()
        }),
            path = cssCachePath + set.id + '.css';

        this.sets.push(set);

        fs.writeFile(path, '', {})
            .done(function(){
                initializer.add(path);
            });
    }
    
    ModalViewModel.prototype.createSet = function(data){
        return {
            name: ko.observable(data.name),
            timestamp: data.timestamp,
            type: data.type,
            id: data.id,
            active: ko.observable(data.active === undefined ? true : !!data.active)
        }
    }

    ModalViewModel.prototype.deserialize = function(data){
        _.each(data, _.bind(function(object){
            var set = this.createSet(object);
            this.sets.push(set);
        }, this));
    }

    module.exports = ModalViewModel;
});
