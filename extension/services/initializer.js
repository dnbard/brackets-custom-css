var DocumentManager = require('document/DocumentManager');

define(function(require, exports, module){
    var storage = require('./storage'),
        _ = require('../vendor/lodash'),
        config = require('../config'),
        CSSControlService = require('./css'),
        watchList = [];

    exports.add = function(path, set){
        if (_.find(watchList, function(subscription){
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
                    document: document,
                    relativePath: '../cache/' + set.id + '.css'
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
                CSSControlService.add('../cache/' + set.id + '.css');

                DocumentManager.getDocumentForPath(path)
                .done(function(document){
                    watchList.push({
                        hash: document.file._hash,
                        path: document.file._path,
                        relativePath: '../cache/' + set.id + '.css',
                        document: document
                    });
                });
            }
        });

        setInterval(function(){
            _.each(watchList, function(doc){
                if (doc.hash !== doc.document.file._hash){
                    doc.hash = doc.document.file._hash;

                    CSSControlService.remove(doc.relativePath);
                    CSSControlService.add(doc.relativePath);
                    if (!doc.relativePath){
                        console.error('Relative path to document must not be undefined');
                    }
                }
            });
        }, 1000);
    }
});
