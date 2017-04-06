'use strict';

var locksmithApp = angular.module('locksmithApp', [
    'ionic',
    'ui.router',
    'ngStorage',
    'ui.gravatar',
    'locksmithServices',
    'locksmithControllers'
]);

angular.module('ui.gravatar').config([
    'gravatarServiceProvider',
    function(gravatarServiceProvider) {
        gravatarServiceProvider.defaults = {
            size: 40,
            default: 'identicon'
        };

        gravatarServiceProvider.secure = true;
    }
]);

locksmithApp.run(function($rootScope, $state, $localStorage) {
    $rootScope.$state = $state;
    window.settings = $rootScope.$settings = $localStorage;

    window.is_chrome_extension = function() {
        return window.chrome &&
            chrome.runtime &&
            chrome.runtime.id &&
            true || false;
    };

    window.is_safari_extension = function() {
        return window.safari &&
            safari.application &&
            true || false;
    };

    $rootScope.$is_extension = is_chrome_extension() || is_safari_extension();

    if (typeof window.settings.bookmarks === 'undefined') {
        window.settings.bookmarks = [];
    }

    $rootScope.jobs = 0;

    $rootScope.$on('loading:start', function() {
        $rootScope.jobs += 1;
    })

    $rootScope.$on('loading:stop', function() {
        $rootScope.jobs -= 1;
    })
});

locksmithApp.config([
    '$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.interceptors.push(function($rootScope) {
            return {
                request: function(config) {
                    $rootScope.$broadcast('loading:start');
                    return config;
                },
                requestError: function(rejection) {
                    $rootScope.$broadcast('loading:stop');
                    return rejection;
                },
                response: function(response) {
                    $rootScope.$broadcast('loading:stop');
                    return response;
                },
                responseError: function(rejection) {
                    $rootScope.$broadcast('loading:stop');
                    return rejection;
                }
            }
        });

        $stateProvider.
        state('bookmarks', {
            abstract: true,
            url: '/bookmarks',
            views: {
                header: {
                    templateUrl: 'partials/header/bookmarks.html'
                },
                main: {
                    templateUrl: 'partials/bookmarks/index.html'
                },
                footer: {
                    templateUrl: 'partials/footer/footer.html'
                }
            }
        }).
        state('bookmarks.list', {
            url: '',
            controller: 'BookmarkIndexController',
            templateUrl: 'partials/bookmarks/list.html'
        }).
        state('bookmarks.show', {
            url: '/:bookmarkId',
            controller: 'BookmarkShowController',
            templateUrl: 'partials/bookmarks/show.html'
        }).
        state('accounts', {
            abstract: true,
            url: '/accounts',
            views: {
                header: {
                    templateUrl: 'partials/header/accounts.html'
                },
                main: {
                    templateUrl: 'partials/common/list-index.html'
                },
                footer: {
                    templateUrl: 'partials/footer/footer.html'
                }
            }
        }).
        state('accounts.list', {
            url: '',
            controller: 'AccountIndexController',
            templateUrl: 'partials/accounts/list.html'
        }).
        state('accounts.show', {
            url: '/:accountId',
            controller: 'AccountShowController',
            templateUrl: 'partials/accounts/show.html'
        }).
        state('settings', {
            url: '/settings',
            controller: 'SettingsController',
            views: {
                header: {
                    templateUrl: 'partials/header/bookmarks.html'
                },
                main: {
                    templateUrl: 'partials/settings.html'
                },
                footer: {
                    templateUrl: 'partials/footer/footer.html'
                }
            }
        }).
        state('setup', {
            abstract: true,
            url: '/setup',
            views: {
                header: {
                    templateUrl: 'partials/header/setup.html'
                },
                main: {
                    templateUrl: 'partials/common/empty.html'
                },
                footer: {
                    templateUrl: 'partials/footer/empty.html'
                }
            }
        }).
        state('setup.do', {
            url: '',
            controller: 'SetupController',
            templateUrl: 'partials/setup.html'
        });

        $urlRouterProvider.otherwise('/bookmarks');

    }
]);
