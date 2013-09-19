function TestController($scope, $timeout, $window) {

    'use strict';
    
    var amplify = $window.apmplify || { store : function () {} },
        console = $window.console || { log : function () {} };
    
    $scope.escribiendo = false;
    $scope.escritos = 0;
    $scope.capacidadDeDisco = amplify.store('capacidadDeDisco') || 500;
    $scope.sectorActual = -1;
    $scope.sectores = [];
    $scope.archivos = amplify.store('archivos') || [];
    $scope.archivoActual = null;

    $scope.obtenerColorHex = function () {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    $scope.eliminar = function (archivo, $event) {
        var i = 0, sector = null;
        for (i = 0; i < $scope.archivos.length; i += 1) {
            if ($scope.archivos[i] === archivo) {
                $scope.archivos.splice(i, 1);
            }
        }

        for (i = 0; i < archivo.locacion.length; i += 1) {
            sector = archivo.locacion[i];
            $scope.sectores[sector].color = 255;
            $scope.sectores[sector].ocupado = false;
        }

        amplify.store('archivos', $scope.archivos);
        $event.preventDefault();
    };

    $scope.agregarArchivo = function ($event) {

        var archivoActual = {
            nombre: $scope.nombre,
            peso: $scope.peso,
            fecha: $scope.fecha,
            color: $scope.obtenerColorHex(),
            locacion: []
        };

        console.log(archivoActual.color);

        $scope.archivos.push(archivoActual);

        $scope.archivoActual = archivoActual;

        $scope.escribiendo = true;

        $event.preventDefault();

    };

    function inicializarSectores() {
        var i = 0, j = 0, sector = null, archivo = null;
        for (i = 0; i < $scope.capacidadDeDisco; i += 1) {

            sector = {
                id: i,
                ocupado: false,
                actual: false,
                color: 255,
                siguiente: null
            };

            $scope.sectores.push(sector);
        }

        if ($scope.archivos.length > 0) {
            for (i = 0; i < $scope.archivos.length; i += 1) {
                archivo = $scope.archivos[i];
                for (j = 0; j < archivo.locacion.length; j += 1) {
                    sector = archivo.locacion[j];
                    $scope.sectores[sector].ocupado = true;
                    $scope.sectores[sector].color = archivo.color;
                }
            }
        }

    }

    function marcarSectorActual() {

        var actualIndex, actual, ultimoIndex, ultimo, anteriorIndex, anterior;
        
        if ($scope.sectorActual === $scope.sectores.length - 1) {
            $scope.sectorActual = -1;
        }

        $scope.sectorActual += 1;
        actualIndex = $scope.sectorActual;
        actual = $scope.sectores[actualIndex];
        actual.actual = true;

        if ($scope.escribiendo && !actual.ocupado) {

            console.log('escribiendo ' + actualIndex + '...');

            actual.ocupado = true;
            actual.color = $scope.archivoActual.color;
            $scope.escritos += 1;
            $scope.archivoActual.locacion.push(actualIndex);

            if ($scope.escritos >= parseInt($scope.peso, 10)) {
                $scope.escritos = 0;
                $scope.nombre = null;
                $scope.peso = null;
                $scope.fecha = null;
                $scope.escribiendo = false;
                $scope.archivoActual = null;
                amplify.store('archivos', $scope.archivos);
            }
        }


        if (actualIndex === 0) {
            ultimoIndex = $scope.sectores.length - 1;
            ultimo = $scope.sectores[ultimoIndex];
            ultimo.actual = false;
        } else {
            anteriorIndex = actualIndex - 1;
            anterior = $scope.sectores[anteriorIndex];
            anterior.actual = false;
        }

        $timeout(marcarSectorActual, 1);
    }

    function constructor() {
        inicializarSectores();
        marcarSectorActual();
    }

    constructor();

}