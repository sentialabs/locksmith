'use strict';

var locksmithControllers = angular.module('locksmithControllers', ['ionic']);

locksmithControllers.controller(
    'SettingsController', ['$scope',
        function($scope) {}
    ]);

locksmithControllers.controller(
    'SetupController', ['$rootScope', '$scope', '$location', '$state',
        function($rootScope, $scope, $location, $state) {
            var setup_variables = {
                'use_local_storage': {
                    type: 'boolean'
                },
                'use_switch_role': {
                    type: 'boolean'
                },
                'incognito_sessions': {
                    type: 'boolean'
                },
                'api': {},
                'api_username': {},
                'api_password': {},
                'aws_access_key_id': {},
                'aws_secret_access_key': {},
                'mfa_serial_number': {},
                'account_management': {
                    type: 'boolean'
                }
            };

            angular.forEach(setup_variables, function(options, setup_variable) {
                var value = $location.search()[setup_variable];

                if (options['type'] == 'boolean') {
                    value = (value == 'true' ? true : false);
                }

                $scope[setup_variable] = value;
            });

            $scope.save = function() {
                angular.forEach(setup_variables, function(options, setup_variable) {
                    $rootScope.$settings[setup_variable] = $scope[setup_variable];
                });

                $state.go('bookmarks.list');
            };
        }
    ]);

locksmithControllers.controller(
    'BookmarkIndexController', ['$rootScope', '$scope', '$state', 'Bookmark', '$location', 'signin', '$ionicPopup',
        function($rootScope, $scope, $state, Bookmark, $location, signin, $ionicPopup) {

            $scope.position = 0;

            $scope.keydown = function(e) {
                switch (e.keyCode) {
                    case 38: // up
                        $scope.position = Math.max(0, $scope.position - 1);
                        break;
                    case 40: // down
                        $scope.position = Math.min(4, $scope.position + 1);
                        break;
                    case 13: // enter
                        var bookmark = $("#bookmarks a.active");
                        setTimeout(function() {
                            bookmark.trigger("click");
                        }, 0);
                        break;
                }
            };

            $scope.showPopup = function() {
                $scope.data = {}

                var myPopup = $ionicPopup.show({
                    templateUrl: 'partials/bookmarks/otp.html',
                    title: 'MFA Token',
                    subTitle: 'Please enter token',
                    scope: $scope,
                    buttons: [{
                        text: 'Cancel'
                    }]
                });

                $scope.popup = myPopup;
            };

            $scope.getToken = function(bookmark) {
                $scope.bookmark = bookmark;
                var promise = signin.assumeRole(bookmark);
                promise.then(function() {}, function(err) {
                    console.log(err);
                    $scope.showPopup();
                });
            };

            $scope.gravatar = function(bookmark) {
                return !/https?:\/\//.test(bookmark.avatar_url);
            }

            $scope.$watch('data.token_code', function(token_code) {
                if (token_code && token_code.length == 6) {
                    $('#token_code').attr('disabled', 'disabled');
                    var promise = signin.assumeRole($scope.bookmark, token_code);
                    promise.then(function() {
                        $('#token_code').removeAttr("disabled");
                        $scope.popup.close();
                    }, function(err) {
                        console.log(err);
                        var popup = $('#token_code').parent().parent().parent().parent();
                        var shakeTime = 50;
                        popup.animate({
                            "margin-left": '-=25',
                        }, shakeTime, function() {
                            popup.animate({
                                "margin-left": '+=50',
                            }, shakeTime, function() {
                                popup.animate({
                                    "margin-left": '-=25',
                                }, shakeTime);
                            });
                        });
                        $('#token_code').val('').removeAttr("disabled").focus();
                    });
                }
            });

            Bookmark.query().$promise.then(function(bookmarks) {
                // loop through all bookmarks, and check if they are included
                // in the favorites. If so, mark them as such
                for (i = 0; i < bookmarks.bookmarks.length; i++) {
                    var bookmark = bookmarks.bookmarks[i];
                    bookmarks.bookmarks[i].is_favorite = false;
                    if (window.settings.favorites.includes(parseInt(bookmark.id))) {
                        bookmarks.bookmarks[i].is_favorite = true;
                    }
                }
                $scope.bookmarks = bookmarks;

                if (typeof $scope.bookmarks.$promise !== 'undefined') {
                    $scope.bookmarks.$promise.then(function(bookmarks) {
                        window.settings.bookmarks = bookmarks.bookmarks;
                    });
                }
            });


            $scope.orderProp = 'name';
            $('#search').focus();
        }
    ]);

locksmithControllers.controller(
    'FavoritesIndexController', ['$rootScope', '$scope', '$state', 'Bookmark', '$location', 'signin', '$ionicPopup', '$controller',

        function($rootScope, $scope, $state, Bookmark, $location, signin, $ionicPopup, $controller) {
            angular.extend(this, $controller('BookmarkIndexController', {
                $scope: $scope
            }));


        }

    ]);


locksmithControllers.controller(
    'BookmarkShowController', ['$scope', '$state', 'Bookmark', '$stateParams',
        function($scope, $state, Bookmark, $stateParams) {

            $scope.bookmarkId = $stateParams.bookmarkId;
            Bookmark.query({
                bookmarkId: $scope.bookmarkId
            }).$promise.then(function(bookmark) {
                bookmark.is_favorite = window.settings.favorites.includes(parseInt(bookmark.id));
                $scope.bookmark = bookmark;
            });

            $scope.save = function() {
                if ($scope.bookmark.id) {
                    $scope.bookmark.$update();
                } else {
                    $scope.bookmark.$create();
                }

                if ($scope.bookmark.is_favorite) {
                    if (!window.settings.favorites.includes(parseInt($scope.bookmark.id))) {
                        window.settings.favorites.push(parseInt($scope.bookmarkId));
                    }
                } else {
                    window.settings.favorites = window.settings.favorites.filter(function(id) {
                        return parseInt(id) != parseInt($scope.bookmarkId);
                    });
                }

                $state.go('bookmarks.list');
            };

            $scope.delete = function() {
                if ($scope.bookmark.id) {
                    $scope.bookmark.$delete();
                }

                $state.go('bookmarks.list');
            };
        }
    ]);


locksmithControllers.controller(
    'AccountIndexController', ['$scope', 'Account', '$location',
        function($scope, Account, $location) {

            $scope.edit = function(account) {
                $location.path('/accounts/' + account.id);
                $scope.$apply();
            };

            $scope.accounts = Account.query();
            $scope.orderProp = 'name';
            $('#search').focus();
        }
    ]);

locksmithControllers.controller(
    'AccountShowController', ['$scope', '$state', 'Account', '$stateParams',
        function($scope, $state, Account, $stateParams) {

            $scope.accountId = $stateParams.accountId;
            $scope.account = Account.query({
                accountId: $scope.accountId
            });

            $scope.save = function() {
                if ($scope.account.id) {
                    $scope.account.$update();
                } else {
                    $scope.account.$create();
                }

                $state.go('accounts.list');
            };

            $scope.delete = function() {
                if ($scope.account.id) {
                    $scope.account.$delete();
                }

                $state.go('accounts.list');
            };
        }
    ]);
