(function(){
    'use strict';

    angular
        .module('app')
        .factory('UsersService', UsersService);

    function UsersService($http, Upload, HttpTokenAuthService, $window){

        var service = {
            getUserPayload: getUserPayload,
            getUserData: getUserData,
            getUserRole: getUserRole,
            getUsers: getUsers,
            uploadImage: uploadImage,
            generateURL: generateURL,
            updateUser: updateUser
        };

        return service;

        function getUserPayload(){
            var token = HttpTokenAuthService.getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload;
            } else {
                return ''
            }
        }

        function getUserData(id){
            return $http.get('/users/' + id).success(function(response){
                return response;
            });
        }


        function getUserRole(user){
            var accessLevel = getUserPayload().accessLevel;
            var userRoles = ['User', 'Redactor', 'Administrator'];
            return userRoles[accessLevel];
        }


        function getUsers(){
            return $http.get('/users').success(function (response) {
                return response;
            });
        }


        function uploadImage(file) {
            return Upload.upload({
                url: '/upload/user-pic/',
                method: 'POST',
                file: file
            }).then(function (response) {
                return response.data;
            });
        }

        function generateURL(filename){
            if(filename){
                return '/images/users/' + filename;
            } else {
                return '/images/service/no-image.png';
            }
        }

        function updateUser(user){
            return $http.put('/users/' + user._id, user).then(function(response){
                return response.data;
            });
        }

    }
})();