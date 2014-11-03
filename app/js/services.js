'use strict';

var locksmithServices = angular.module('locksmithServices', ['ngResource']);

locksmithServices.factory('Bookmark', ['$resource', function($resource) {
    if (window.settings.use_local_storage) {
        return {
            'get': function() {},
            'create': function() {},
            'update': function() {},
            'query': function(options) {
                if (typeof options === 'undefined') {
                    var options = {};
                }

                if (typeof options['bookmarkId'] !== 'undefined') {
                    var bookmark = window.settings.bookmarks[options['bookmarkId']];
                    if (typeof bookmark === 'undefined') {
                        bookmark = {};
                    }
                    bookmark.id = options['bookmarkId'];
                    bookmark.$update = function() {
                        window.settings.bookmarks[options['bookmarkId']] = bookmark;
                    };
                    bookmark.$create = function() {
                        window.settings.bookmarks.push(bookmark);
                    };
                    bookmark.$delete = function() {
                        if (typeof bookmark.id !== 'undefined') {
                            window.settings.bookmarks.splice(bookmark.id, 1);
                        }
                    };
                    return bookmark;
                } else {
                    return {
                        bookmarks: jQuery.map(
                            window.settings.bookmarks,
                            function(bookmark, id) {
                                bookmark.id = id;
                                return bookmark;
                            }
                        )
                    };
                }
            },
            'remove': function() {},
            'delete': function() {}
        };
    } else {
        return $resource(
            window.settings.api + '/v1/bookmarks/:bookmarkId', {
                bookmarkId: '@id'
            }, {
                'get': {
                    method: 'GET',
                    headers: {
                        authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                    }
                },
                'create': {
                    method: 'POST',
                    headers: {
                        authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                    }
                },
                'update': {
                    method: 'PUT',
                    headers: {
                        authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                    }
                },
                'query': {
                    method: 'GET',
                    isArray: false,
                    headers: {
                        authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                    }
                },
                'remove': {
                    method: 'DELETE',
                    headers: {
                        authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                    }
                },
                'delete': {
                    method: 'DELETE',
                    headers: {
                        authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                    }
                }
            }
        );
    }
}]);

locksmithServices.factory('Account', ['$resource', '$http', function($resource, $http) {
    return $resource(
        window.settings.api + '/v1/accounts/:accountId', {
            accountId: '@id'
        }, {
            'get': {
                method: 'GET',
                headers: {
                    authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                }
            },
            'create': {
                method: 'POST',
                headers: {
                    authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                }
            },
            'update': {
                method: 'PUT',
                headers: {
                    authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                }
            },
            'query': {
                method: 'GET',
                isArray: false,
                headers: {
                    authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                }
            },
            'remove': {
                method: 'DELETE',
                headers: {
                    authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                }
            },
            'delete': {
                method: 'DELETE',
                headers: {
                    authorization: 'Basic ' + btoa(window.settings.api_username + ':' + window.settings.api_password)
                }
            }
        }
    );
}]);

locksmithServices.factory('signin', ['$q', '$http', '$location', function($q, $http, $location) {
    var signin = {};

    signin.assumeRole = function(bookmark, token_code) {
        var deferred = $q.defer();

        setTimeout(function() {
            var credentials = {
                accessKeyId: window.settings.aws_access_key_id,
                secretAccessKey: window.settings.aws_secret_access_key
            };

            var params = {
                RoleArn: 'arn:aws:iam::' + bookmark.account_number + ':role/' + bookmark.role_name,
                RoleSessionName: 'AssumeRoleSession'
            };

            if (token_code) {
                params['SerialNumber'] = window.settings.mfa_serial_number;
                params['TokenCode'] = token_code;
            }

            var sts = new AWS.STS(credentials);
            sts.assumeRole(params, function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    signin.getSigninToken(
                        data.Credentials.AccessKeyId,
                        data.Credentials.SecretAccessKey,
                        data.Credentials.SessionToken
                    );
                    deferred.resolve();
                }
            });
        }, 0);

        return deferred.promise;
    };

    signin.getSigninToken = function(access_key_id, secret_access_key, session_token) {
        var temp_credentials = {
            sessionId: access_key_id,
            sessionKey: secret_access_key,
            sessionToken: session_token
        };

        var request_parameters = "?Action=getSigninToken";
        request_parameters += "&SessionDuration=" + 3600 * 4;
        request_parameters += "&Session=";
        request_parameters += encodeURIComponent(JSON.stringify(temp_credentials));

        var request_url = "https://signin.aws.amazon.com/federation";
        request_url += request_parameters;

        // startJob();
        $http.get(request_url).success(function(data) {
            // stopJob();
            signin.redirect(data.SigninToken);
        });
    };

    signin.redirect = function(signinToken) {
        var request_parameters = "?Action=login";
        request_parameters += "&Issuer=";
        request_parameters += "&Destination=";
        request_parameters += encodeURIComponent("https://console.aws.amazon.com/?region=eu-west-1");
        request_parameters += "&SigninToken=" + encodeURIComponent(signinToken);

        var request_url = "https://signin.aws.amazon.com/federation";
        request_url += request_parameters;

        if (navigator.userAgent.indexOf('Chrome') > -1) {
            if (chrome) {
                chrome.windows.create({
                    url: request_url,
                    incognito: window.settings.incognito_sessions
                });
            } else {
                window.location.href = request_url;
            }
        } else if (navigator.userAgent.indexOf("Safari") > -1) {
            var tab = safari.application.openBrowserWindow().activeTab;
            tab.url = request_url;
        } else {
            window.location.href = request_url;
        }
    };

    return signin;
}]);
