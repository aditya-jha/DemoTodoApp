
'use strict';

var todoApp = angular.module('todoApp',
[
    'ngRoute',
    'ui.bootstrap', 
    'ui.bootstrap.datetimepicker',
    'todoAppController',
    'LocalStorageModule'
]
);

todoApp.config(['$routeProvider', '$locationProvider', 'localStorageServiceProvider',
   function($routeProvider, $locationProvider, localStorageServiceProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
                controller: 'MainController'
            })
            .when('/add', {
                templateUrl: 'partials/add.html',
                controller: 'AddController'
            })
            .when('/insert/:startDT/:endDT/:titleTask', {
                controller: 'InsertController',
                template: ""
            })
            .when('/edit/:taskID', {
                templateUrl: 'partials/edit.html',
                controller: 'EditController',
            });
     
        $locationProvider.html5Mode(false).hashPrefix('!');

        localStorageServiceProvider.setPrefix('todoApp');
        localStorageServiceProvider.setStorageType('localStorage');

}]);