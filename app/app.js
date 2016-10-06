/**
 * Created by Sumiko on 10/4/2016.
 */

(function() {
    var app = angular.module("graphingApp", ['n3-line-chart', 'data-generator']);

    app.controller('MainCtrl', function ($scope) {

        var alpha = 0.261; // L/g
        var beta = 0.0017; // L/mL
        var delta = 0.0037; // g/mL
        var gamma = 14.9; // m/h

        $scope.inputs = {
            svisn: 0,
            numClarifiers: 0,
            areaClarifiers: 0,
            MLSS: 0,
            influent: 0,
            ras: 0,
            fluxUnits: "kgmh"
        }

        $scope.data = {
            dataset0: [
                {x: 0, val_0: 0},
                {x: .1, val_0: 1},
                {x: .2, val_0: 2},
                {x: .3, val_0: 3},
                {x: .4, val_0: 4},
                {x: .5, val_0: 5},
                {x: .6, val_0: 6},
                {x: .7, val_0: 7}
                ],

            dataset1: [
                {x: 0, val_0: 0},
                {x: 9.6, val_0: 6.8}
            ],

            dataset2: [
                {x: 0, val_0: 0},
                {x: 20, val_0: 1.0}
            ],

            dataset3: [
                {x:5, val_0: 5}
            ]
        };

        $scope.options = {
            margin: {top: 5},
            series: [
                {
                    axis: "y",
                    dataset: "dataset0",
                    key: "val_0",
                    label: "Settling Flux Curve",
                    color: "0000FF",
                    type: ['line'],
                    id: 'mySeries0'
                },
                {
                    axis: "y",
                    dataset: "dataset1",
                    key: "val_0",
                    label: "Surface Overflow Rateline",
                    color: "00FF00",
                    type: ['line'],
                    id: 'mySeries1'
                },
                {
                    axis: "y",
                    dataset: "dataset2",
                    key: "val_0",
                    label: "Solids Underflow line",
                    color: "FFFF00",
                    type: ['line'],
                    id: 'mySeries2'
                },
                {
                    axis: "y",
                    dataset: "dataset3",
                    key: "val_0",
                    label: "State Point",
                    color: "FF0000",
                    type: ['dot'],
                    id: 'mySeries3'
                }
            ],
            axes: {x: {key: "x"}}
        };

        $scope.changeData = function() {
            console.log("changeData : " + $scope.inputs.svisn);

            var valuesObj = {
                SVISN: $scope.inputs.svisn, //173  mL/g
                numClarifiers: $scope.inputs.numClarifiers, //4,
                areaClarifiers: $scope.inputs.areaClarifiers, // 4776, // ft2
                MLSS: $scope.inputs.MLSS, //4, // g/L
                influentFlow: $scope.inputs.influent, //8, // mgd
                RASflow: $scope.inputs.ras, //2 // mgd
                fluxUnits: $scope.inputs.fluxUnits
            };


            $scope.changeDataSet0(valuesObj);  // blue line
            $scope.changeDataSet1(valuesObj);  // green line
            $scope.changeDataSet2(valuesObj);    // yellow line
            $scope.changeDataSet3(valuesObj);   // red dot
        };

        $scope.changeDataSet0 = function (valuesObj) {
            var i, datalen, solidConc, flux;

            // Let's calculate 150 values for now
            datalen = 150;

            for(i=0; i<datalen; i++) {
                solidConc = .1 * i;
                flux = $scope.calcData(solidConc, valuesObj);
                console.log(i + " solidConc:" + solidConc + " flux:" + flux + " svisn:" + $scope.inputs.svisn);
                var dataSetTuple = {x: solidConc, val_0: flux};
                $scope.data.dataset0[i] = dataSetTuple;
            }
        };

        $scope.calcData = function (solidsConcentration, valuesObj) {
            var fluxUnitsConst_kgm2h = 1;
            var fluxUnitsConst_kgm2d = 24;
            var fluxUnitsConst_lbft2 = 4.9111739207;

            var unitsConst = fluxUnitsConst_kgm2h;

            if (valuesObj.fluxUnits == "kgmd") {
                unitsConst = fluxUnitsConst_kgm2d;
            } else if (valuesObj.fluxUnits == "lbftd") {
                unitsConst = fluxUnitsConst_lbft2;
            }
            console.log("unitsConst: " + unitsConst);

            var solidsFlux = $scope.calcSolidsFlux(solidsConcentration, valuesObj, unitsConst);
            return solidsFlux;

        };

        $scope.calcSolidsFlux = function (solidsConcentration, inputsObj, unitsConstant) {
            // Enhancement possibility: try doing this math without floating point number - convert to int first x10

            var firstpart = unitsConstant * solidsConcentration * gamma;
            var power = -1 * delta * inputsObj.SVISN - (alpha + beta * inputsObj.SVISN) * solidsConcentration;
            var secondpart = Math.exp(power);

            return firstpart * secondpart;

        };

        $scope.changeDataSet1 = function (valuesObj) {
            // Only need to calculate 2 values. Always 0,0 and one point

            var y = $scope.dataSet1calcY(valuesObj);
            var x = $scope.dataSet1calcX(valuesObj, y);

            console.log("x: " + x + " y: " + y);

            var dataSetTuple = {x: x, val_0: y};
            $scope.data.dataset1[1] = dataSetTuple;
        };

        $scope.dataSet1calcY = function(valuesObj){

            var fluxUnitsConst_kgm2h = 1;
            var fluxUnitsConst_kgm2d = 24;
            var fluxUnitsConst_lbft2 = 4.9111739207;

            var unitsConst = fluxUnitsConst_kgm2h;
            if (valuesObj.fluxUnits == "kgmd") {
                unitsConst = fluxUnitsConst_kgm2d;
            } else if (valuesObj.fluxUnits == "lbftd") {
                unitsConst = fluxUnitsConst_lbft2;
            }

            var p1 = 1.25;
            var p2 = unitsConst;
            var p3 = gamma * Math.exp(-1* delta * valuesObj.SVISN - 1);
            var p4 = alpha + beta * valuesObj.SVISN;
            var y = p1*p2*p3/p4;

            return y;
        };

        $scope.dataSet1calcX = function(valuesObj, y){
            var fluxUnitsConst_kgm2h = 0.000589019116;
            var fluxUnitsConst_kgm2d = 0.0000245424631;
            var fluxUnitsConst_lbft2 = 0.000119934485;

            var unitsConst = fluxUnitsConst_kgm2h;
            if (valuesObj.fluxUnits == "kgmd") {
                unitsConst = fluxUnitsConst_kgm2d;
            } else if (valuesObj.fluxUnits == "lbftd") {
                unitsConst = fluxUnitsConst_lbft2;
            }

            var p1 = unitsConst;
            var p2 = y;
            var p3 = valuesObj.numClarifiers;
            var p4 = valuesObj.areaClarifiers/valuesObj.influentFlow;
            var x = p1*p2*p3*p4;

            return x;
        };

        $scope.changeDataSet2 = function (valuesObj) {
            // Need to calculate 2 tuples {0, y1} and {x2, y2}

            var y1 = $scope.dataSet2calcY1(valuesObj);
            $scope.data.dataset2[0] = {x: 0, val_0: y1};

            console.log("ds2: y1:" + y1);

            var x2 = $scope.dataSet2calcX2(valuesObj, y1);
            var y2 = $scope.dataSet2calcY2(valuesObj, x2, y1);
            $scope.data.dataset2[1] = {x: x2, val_0: y2};
            console.log("ds2: x2: " + x2 + "y2:" + y2);

        };

        $scope.dataSet2calcY1 = function(valuesObj){
            var fluxUnitsConst_kgm2h = 1697.73777048;
            var fluxUnitsConst_kgm2d = 40745.7064914;
            var fluxUnitsConst_lbft2 = 8337.88546256;

            var unitsConst = fluxUnitsConst_kgm2h;
            if (valuesObj.fluxUnits == "kgmd") {
                unitsConst = fluxUnitsConst_kgm2d;
            } else if (valuesObj.fluxUnits == "lbftd") {
                unitsConst = fluxUnitsConst_lbft2;
            }

            var p1 = unitsConst;
            var p2 = valuesObj.influentFlow + valuesObj.RASflow;
            var p3 = valuesObj.MLSS/(valuesObj.numClarifiers*valuesObj.areaClarifiers);
            console.log("ds2calcy1: mlss: " + valuesObj.MLSS + " numclarifiers: " + valuesObj.numClarifiers + " areaClarifiers:" + valuesObj.areaClarifiers);
            console.log("ds2calcy1: p2: " + p2 + " p3: " + p3 + " p1*p2*p3:" + p1*p2*p3);
            return p1*p2*p3;
        };

        $scope.dataSet2calcX2 = function(valuesObj, y1){
            var fluxUnitsConst_kgm2h = 0.000589019116;
            var fluxUnitsConst_kgm2d = 0.0000245424631;
            var fluxUnitsConst_lbft2 = 0.000119934485;

            var unitsConst = fluxUnitsConst_kgm2h;
            if (valuesObj.fluxUnits == "kgmd") {
                unitsConst = fluxUnitsConst_kgm2d;
            } else if (valuesObj.fluxUnits == "lbftd") {
                unitsConst = fluxUnitsConst_lbft2;
            }

            var p1 = unitsConst;
            var p2 = valuesObj.numClarifiers * valuesObj.areaClarifiers/valuesObj.RASflow;
            return p1*y1*p2;
        };

        $scope.dataSet2calcY2 = function(valuesObj, x2, y1){
            var fluxUnitsConst_kgm2h = 1697.73777048;
            var fluxUnitsConst_kgm2d = 40745.7064914;
            var fluxUnitsConst_lbft2 = 8337.88546256;

            var unitsConst = fluxUnitsConst_kgm2h;
            if (valuesObj.fluxUnits == "kgmd") {
                unitsConst = fluxUnitsConst_kgm2d;
            } else if (valuesObj.fluxUnits == "lbftd") {
                unitsConst = fluxUnitsConst_lbft2;
            }

            var p1 = unitsConst;
            var p2 = x2 * valuesObj.RASflow/(valuesObj.numClarifiers * valuesObj.areaClarifiers);
            return -1 * p1 * p2 + y1;
        };

        $scope.changeDataSet3 = function (valuesObj) {
            // Need to calculate {MLSS, y1}

            var x = valuesObj.MLSS;
            var y1 = $scope.dataSet3calcY1(valuesObj);

            $scope.data.dataset3[0] = {x: x, val_0: y1};

            console.log("ds3: x:" + x + " y1:" + y1);

        };

        $scope.dataSet3calcY1 = function(valuesObj){
            var fluxUnitsConst_kgm2h = 1697.73777048;
            var fluxUnitsConst_kgm2d = 40745.7064914;
            var fluxUnitsConst_lbft2 = 8337.88546256;

            var unitsConst = fluxUnitsConst_kgm2h;
            if (valuesObj.fluxUnits == "kgmd") {
                unitsConst = fluxUnitsConst_kgm2d;
            } else if (valuesObj.fluxUnits == "lbftd") {
                unitsConst = fluxUnitsConst_lbft2;
            }
            var p1 = unitsConst;
            var p2 = valuesObj.MLSS;
            var p3 = valuesObj.influentFlow /(valuesObj.numClarifiers * valuesObj.areaClarifiers);
            return p1 * p2 * p3;
        };

    });
})();