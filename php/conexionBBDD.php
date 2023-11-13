<?php
	class conexion{
		private $servidor;
		private $usuario;
		private $contrasena;
		private $basedatos;
		public $conexion;
		public function __construct(){
		    $this->servidor = "localhost";
			$this->usuario = "root";
			$this->contrasena = "root"; // En windows, en esta opción se dejan vacíos los corchetes
			$this->basedatos = "datos_adiiu";
		}
		function conectar(){
			$this->conexion = new mysqli($this->servidor,$this->usuario,$this->contrasena,$this->basedatos);
			$this->conexion->set_charset("utf8");
		}
		function cerrar(){
			$this->conexion->close();	
		}
	}


  class BBDD_Grafico{
		private $conexion;
		function __construct()
		{
			$this->conexion = new conexion();
			$this->conexion->conectar();
        }


		function TraerDatosGraficos(){
			$sql = "SELECT COUNT(*),AVG(`math score`), AVG(`reading score`), AVG(`writing score`) FROM data_txt";	
			$arreglo = array();
			if ($consulta = $this->conexion->conexion->query($sql)) {

				while ($consulta_VU = mysqli_fetch_array($consulta)) {
					$arreglo[] = $consulta_VU;
					
				}
				return $arreglo;
				$this->conexion->cerrar();	
			}
		}

		function MediaMatesPorEtnias(){
			$sql = "SELECT `race/ethnicity`,AVG(`math score`) AS MEDIA_MATEMÁTICAS FROM data_txt GROUP BY `race/ethnicity` ORDER BY MEDIA_MATEMÁTICAS DESC";	
			
			$arreglo = array();
			if ($consulta = $this->conexion->conexion->query($sql)) {

				while ($consulta_VU = mysqli_fetch_array($consulta)) {
					$arreglo[] = $consulta_VU;
					
				}
				return $arreglo;
				$this->conexion->cerrar();	
			}
		}

		function NotasWritingPorGenero(){
			$sql = "SELECT gender,`writing score` FROM data_txt";	
			
			$arreglo = array();
			if ($consulta = $this->conexion->conexion->query($sql)) {

				while ($consulta_VU = mysqli_fetch_array($consulta)) {
					$arreglo[] = $consulta_VU;
					
				}
				return $arreglo;
				$this->conexion->cerrar();	
			}
		}
		function NivelEducacionParental(){
			$sql = "SELECT `parental level of education`,COUNT(`parental level of education`) AS Recuento FROM data_txt GROUP BY `parental level of education` ORDER BY Recuento";	
			
			$arreglo = array();
			if ($consulta = $this->conexion->conexion->query($sql)) {

				while ($consulta_VU = mysqli_fetch_array($consulta)) {
					$arreglo[] = $consulta_VU;
					
				}
				return $arreglo;
				$this->conexion->cerrar();	
			}
		}

	}

  $MG = new BBDD_Grafico();
  $consulta[] = $MG -> TraerDatosGraficos();
	$consulta[] = $MG -> MediaMatesPorEtnias();
	$consulta[] = $MG -> NotasWritingPorGenero();
	$consulta[] = $MG -> NivelEducacionParental();



  echo json_encode($consulta);
  
?> 