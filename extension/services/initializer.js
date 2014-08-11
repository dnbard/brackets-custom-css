var DocumentManager = require('document/DocumentManager');

define(function(require, exports, module){
    var storage = require('./storage'),
        _ = require('../vendor/lodash'),
        config = require('../config'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
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
            var path = config.path + 'cache/' + set.id + '.css';
            ExtensionUtils.loadStyleSheet(module, path);

            DocumentManager.getDocumentForPath(path)
                .done(function(document){
                    watchList.push({
                        hash: document.file._hash,
                        path: document.file._path,
                        document: document
                    });
                });

            setInterval(function(){
                _.each(watchList, function(doc){
                    if (doc.hash !== doc.document.file._hash){
                        doc.hash = doc.document.file._hash;
                        console.log(doc);

                        ExtensionUtils.loadStyleSheet(module, doc.path);
                    }
                });
            }, 1000);
        });
    }
});
