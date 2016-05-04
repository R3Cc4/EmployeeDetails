var app = angular.module('myApp', ['ui.bootstrap', 'ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.exporter']);
app.filter('offset', function () {
    return function (input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});
app.controller(
    'myCtrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {


        $scope.pageSize = 10;
        $scope.maxSize = 5;
        $scope.currentPage = 1;
        console.log(employeeDetails);
        $scope.totalEmployees = employeeDetails;
        $scope.employees = $scope.totalEmployees.slice(0, $scope.pageSize);
        $scope.exportAll = function () {
            console.log("Exporting all Employees");
        }
        $scope.pageChanged = function () {

            if (($scope.pageSize * $scope.currentPage) < $scope.totalEmployees.length) {
                $scope.employees = $scope.totalEmployees
                    .slice(
                        $scope.pageSize * ($scope.currentPage - 1),
                        $scope.pageSize * $scope.currentPage);

            } else {
                $scope.employees = $scope.totalEmployees
                    .slice($scope.pageSize * ($scope.currentPage - 1));

            }
        };
            }]);