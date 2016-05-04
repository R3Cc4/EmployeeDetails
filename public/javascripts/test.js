var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.exporter']);

app.controller('MainCtrl', [
  '$scope', '$http','$httpParamSerializer', 'uiGridConstants',
    function ($scope, $http, $httpParamSerializer,uiGridConstants) {

        var paginationOptions = {
            sort: null
        };

        $scope.gridOptions = {
            paginationPageSizes: [15, 20, 25],
            paginationPageSize: 15,
            useExternalPagination: true,
            useExternalSorting: true,
            enableGridMenu: true,
            exporterMenuCsv: false,
            columnDefs: [
                {
                    name: 'First Name'
                },
                {
                    name: 'Last Name',
                    enableSorting: false
                },
                {
                    name: 'Manager Name',
                    enableSorting: false
                },
                {
                    name: 'Date Of Joining',
                    enableSorting: false
                },
                {
                    name: 'Work Experience',
                    enableSorting: false
                }
      ],
            gridMenuCustomItems: [
                {
                    title: 'Delete Selected Rows',
                    action: function ($event) {


                        var selectedRows = $scope.gridApi.selection.getSelectedRows();
                        console.log($scope.gridApi.selection.getSelectedGridRows());

                        var idsToDelete = [];
                        for (var i = 0; i < selectedRows.length; i++) {

                            idsToDelete.push(selectedRows[i]._id);
                        }
                       
                        angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
    $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
});
                        var token = window.localStorage.getItem('token');
                        $http({
                            method: 'GET',
                            url: '/deleteEmployees',
                             headers: {
                             'x-access-token': token
                                },
                            params: {
                                id: JSON.stringify(idsToDelete) // ids is [1, 2, 3, 4]
                            }
                        }).success(function (err, data) {

                        });
                        //this.grid.element.toggleClass('rotated');
                    },
                    order: 210
      }
    ],
            exporterAllDataFn: function () {
                return getPage(1, $scope.gridOptions.totalItems, paginationOptions.sort)
                    .then(function () {
                        $scope.gridOptions.useExternalPagination = false;
                        $scope.gridOptions.useExternalSorting = false;
                        getPage = null;
                    });
            },
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (getPage) {
                        if (sortColumns.length > 0) {
                            paginationOptions.sort = sortColumns[0].sort.direction;
                        } else {
                            paginationOptions.sort = null;
                        }
                        getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions.sort)
                    }
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if (getPage) {
                        getPage(newPage, pageSize, paginationOptions.sort);
                    }
                });
            }
        };

        var getPage = function (curPage, pageSize, sort) {
            var url;
            switch (sort) {
            case uiGridConstants.ASC:
                url = '/data/100_ASC.json';
                break;
            case uiGridConstants.DESC:
                url = '/data/100_DESC.json';
                break;
            default:
                url = '/employees';
                break;
            }

            var _scope = $scope;
            

            var authDetails={'name':'vamsikrishna123','password':'test123'}
            return $http({
 method: 'GET',
 url: '/employees',
 headers: {
   'Content-Type': 'application/x-www-form-urlencoded'
 },
  params: {
           auth: JSON.stringify(authDetails) // ids is [1, 2, 3, 4]
                            }
}).success(function (data) {
                    console.log(data.employees);
                    if(typeof data.result != undefined){
                    var firstRow = (curPage - 1) * pageSize;
                    $scope.gridOptions.totalItems = 50;
                    $scope.gridOptions.data = data.employees.result.slice(firstRow, firstRow + pageSize)
                    window.localStorage.setItem('token', data.token);
                    console.log(window.localStorage.getItem('token'));
                    }
                });
        };

        getPage(1, $scope.gridOptions.paginationPageSize);
  }
]);