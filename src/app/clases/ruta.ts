export class Ruta{
  public distancia:Distancia;
  public desc     :string = 'Sin titulo';
  direccionInicio :Direccion;
  direccionFin    :Direccion;
  duracion: Duracion;
  pasos: Pasos;
  constructor( data: any ){
    this.distancia        =   { valor : data.distance.value, texto: data.distance.text };
    this.duracion         =   { valor : data.duration.value, texto: data.duration.text};
    this.direccionFin     =   { texto : data.end_address};
    this.direccionInicio  =   { texto : data.start_address};
    console.log(data);
  }
}

interface Distancia {
  valor: number,
  texto: string
}

interface Duracion {
  valor: number,
  texto: string
}

interface Direccion{
  texto:  string,

}

interface Pasos{
  distancia:Distancia ;
  duracion: Duracion;
  instructions:string;
}
