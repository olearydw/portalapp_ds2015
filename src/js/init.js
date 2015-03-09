(function () {
    'use strict';

    var pathRX = new RegExp(/\/[^\/]+$/);
    var locationPath = location.pathname.replace(pathRX, '');

    require({
        async: true,
        aliases: [
          ['text', 'dojo/text']
        ],
        packages: [{
            name: 'controllers',
            location: locationPath + '/js/controllers',
            //main: 'main'
            main: 'appController'
        },{
            name: 'config',
            location: locationPath + '/config'
        },{
            name: 'maps',
            location: locationPath + '/js/maps'
        }, {
            name: 'services',
            location: locationPath + '/js/services'
        }, {
            name: 'utils',
            location: locationPath + '/js/utils'
        }, {
            name: 'models',
            location: locationPath + '/js/models'
        }, {
            name: 'app',
            location: locationPath + '/js'
            //main: 'main'
        }]
    }, ['controllers']);

})();
