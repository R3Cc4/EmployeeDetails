var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.exporter']);

app.controller('MainCtrl', [
  '$scope', '$http', 'uiGridConstants',
    function ($scope, $http, uiGridConstants) {

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
                        console.log(idsToDelete);
                        /*angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
    $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
});*/
                        $http({
                            method: 'GET',
                            url: '/deleteEmployees',
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
            return $http.get(url)
                .success(function (data) {
                    console.log(data.result);
                    var firstRow = (curPage - 1) * pageSize;
                    $scope.gridOptions.totalItems = 50;
                    $scope.gridOptions.data = data.result.slice(firstRow, firstRow + pageSize)
                });
        };

        getPage(1, $scope.gridOptions.paginationPageSize);
  }
]);