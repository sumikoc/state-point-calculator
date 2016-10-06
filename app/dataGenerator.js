/**
 * Created by Sumiko on 10/5/2016.
 */
(function() {
    var app = angular.module('data-generator', []);

    app.controller('DataController', function () {
       this.data = 1;
        this.getData = function() {
            return this.data;
        };
    });
})();
