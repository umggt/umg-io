var globalScope = null;

function TestController($scope, $timeout)
{

	globalScope = $scope;

	$scope.escribiendo = false;
	$scope.escritos = 0;
	$scope.capacidadDeDisco = 500;
	$scope.sectorActual = -1;
	$scope.sectores = [];
	$scope.archivos = [];
	$scope.archivoActual = null;

	$scope.agregarArchivo = function () {

		var archivoActual = {
			nombre: $scope.nombre,
			peso: $scope.peso,
			fecha: $scope.fecha,
			locacion: []
		};

		$scope.archivos.push(archivoActual);

		console.log($scope.archivos);

		$scope.archivoActual = archivoActual;

		$scope.escribiendo = true;

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

	};

	function marcarSectorActual() {

		if ($scope.sectorActual === $scope.sectores.length - 1) {
			$scope.sectorActual = -1;
		}

		var actualIndex = ++$scope.sectorActual;



		var actual = $scope.sectores[actualIndex];
		actual.actual = true;

		if ($scope.escribiendo && !actual.ocupado) {

			console.log('escribiendo ' + actualIndex + '...');

			if ($scope.escritos === 0) {
				// Es el primer sector del archivo, agregarlo a la tabla.
			}

			actual.ocupado = true;
			$scope.escritos++;
			$scope.archivoActual.locacion.push(actualIndex);

			if ($scope.escritos >= parseInt($scope.peso)) {
				$scope.escritos = 0;
				$scope.nombre = null;
				$scope.peso = null;
				$scope.fecha = null;
				$scope.escribiendo = false;
				//$scope.archivoActual = null;
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