function TestController($scope, $timeout) {

    'use strict';

    $scope.escribiendo = false;
    $scope.escritos = 0;
    $scope.capacidadDeDisco = amplify.store('capacidadDeDisco') || 500;
    $scope.sectorActual = -1;
    $scope.sectores = [];
    $scope.archivos = amplify.store('archivos') || [];
    $scope.archivoActual = null;
    $scope.rojo = amplify.store('rojo') || 0;
    $scope.verde = amplify.store('verde') || 0;
    $scope.azul = amplify.store('azul') || 0;

    $scope.calcularColor = function() {

        $scope.azul += 20;
        $scope.verde += 20;
        $scope.rojo += 20;

        if ($scope.azul > 255) {
            $scope.azul = 1;
        }

        if ($scope.verde > 255) {
            $scope.verde = 1;
        }

        if ($scope.rojo > 255) {
            $scope.rojo = 1;
        }

        amplify.store('rojo', $scope.rojo); 
        amplify.store('verde', $scope.verde); 
        amplify.store('azul', $scope.azul); 
        
    };

    $scope.obtenerColorHex = function() {

        return '#' + Math.floor(Math.random()*16777215).toString(16);
        /*$scope.calcularColor();

        var rojo = $scope.rojo.toString(16); 
        var verder = $scope.verde.toString(16); 
        var azul = $scope.azul.toString(16);

        rojo = rojo.length == 1 ? '0' + rojo.length : rojo;
        verder = verder.length == 1 ? '0' + verder.length : verder;
        azul = azul.length == 1 ? '0' + azul.length : azul;

        var color = rojo + verder + azul;
        return '#' + color;*/

    };

    $scope.eliminar = function (archivo, $event) {
        $scope.archivos.pop(archivo);

        for (var i = 0; i < archivo.locacion.length; i++) {
            var sector = archivo.locacion[i];
            $scope.sectores[sector].color = 255;
            $scope.sectores[sector].ocupado = false;
        };

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
        for (var i = 0; i < $scope.capacidadDeDisco; i++) {

            var sector = { 
                id: i, 
                ocupado: false, 
                actual: false, 
                color: 255, 
                siguiente: null,
            };

            $scope.sectores.push(sector);
        };

        if ($scope.archivos.length > 0) {
            for (var i = 0; i < $scope.archivos.length; i++) {
                var archivo = $scope.archivos[i];
                for (var j = 0; j < archivo.locacion.length; j++) {
                    var sector = archivo.locacion[j];
                    $scope.sectores[sector].ocupado = true;
                    $scope.sectores[sector].color = archivo.color;
                };
            };
        }

    }

    function marcarSectorActual() {

        if ($scope.sectorActual === $scope.sectores.length - 1) {
            $scope.sectorActual = -1;
        }

        var actualIndex = ++$scope.sectorActual;
        var actual = $scope.sectores[actualIndex];
        actual.actual = true;

        if ($scope.escribiendo && !actual.ocupado) {

            console.log('escribiendo ' + actualIndex + '...');

            actual.ocupado = true;
            actual.color = $scope.archivoActual.color;
            $scope.escritos++;
            $scope.archivoActual.locacion.push(actualIndex);

            if ($scope.escritos >= parseInt($scope.peso)) {
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
            var ultimoIndex = $scope.sectores.length - 1;
            var ultimo = $scope.sectores[ultimoIndex];
            ultimo.actual = false;
        }
        else {
            var anteriorIndex = actualIndex - 1;
            var anterior = $scope.sectores[anteriorIndex]; 
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

$(function(){
    //$('input[type=date]').datepicker();
});