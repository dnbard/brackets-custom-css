var DocumentManager = require('document/DocumentManager');

define(function(require, exports, module){
    var storage = require('./storage'),
        _ = require('../vendor/lodash'),
        config = require('../config'),
        CSSControlService = require('./css'),
        watchList = [];

    exports.add = function(path){
        if (_.filter(watchList, function(subscription){
            return subscription.path === path;
        })){
            //this file is already in watching list
            return;
        }

        DocumentManager.getDocumentForPath(path)
            .done(function(document){
                watchList.push({
                    hash: document.file._hash,
                    path: document.file._path,
                    document: document
                });
            });
    }

    exports.remove = function(path){
        _.remove(watchList, function(subscription){
            return subscription.path === path;
        });
    }

    exports.init = function(){
        _.each(storage.get(), function(set){
            var path = config.path + 'cache/' + set.id + '.css',
                isActive = set.active === undefined? true : !!set.active;

            if(isActive){
                CSSControlService.add(path);

                DocumentManager.getDocumentForPath(path)
                .done(function(document){
                    watchList.push({
                        hash: document.file._hash,
                        path: document.file._path,
                        document: document
                    });
                });
            }
        });

        setInterval(function(){
            _.each(watchList, function(doc){
                if (doc.hash !== doc.document.file._hash){
                    doc.hash = doc.document.file._hash;
                    console.log(doc);

                    //TODO: remove CSS reference from DOM
                    CSSControlService.remove(doc.path);
                    CSSControlService.add(doc.path);
                }
            });
        }, 1000);
    }
});
