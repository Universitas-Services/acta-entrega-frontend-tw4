'use client';
import { useEffect } from 'react';
import { FormField } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import type {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from 'react-hook-form';

// Datos de estados y ciudades de Venezuela
const venezuelaData = {
  Amazonas: [
    'La Esmeralda',
    'San Fernando de Atabapo',
    'Puerto Ayacucho',
    'Isla de Ratón',
    'San Juan de Manapiare',
    'Maroa',
    'San Carlos de Río Negro',
  ],
  Anzoátegui: [
    'Anaco',
    'Aragua de Barcelona',
    'Lechería',
    'Puerto Píritu',
    'Valle de Guanape',
    'Pariaguán',
    'Guanta',
    'Puerto La Cruz',
    'Onoto',
    'San Mateo',
    'Clarines',
    'Píritu',
    'San José de Guanipa',
    'Boca de Uchire',
    'Santa Ana',
    'Barcelona',
    'El Tigre',
    'El Chaparro',
    'El Pueblo de Queregua',
  ],
  Apure: [
    'Achaguas',
    'Biruaca',
    'Bruzual',
    'Guasdualito',
    'San Juan de Payara',
    'Elorza',
    'San Fernando de Apure',
  ],
  Aragua: [
    'San Mateo',
    'Camatagua',
    'Santa Rita',
    'Maracay',
    'Santa Cruz',
    'La Victoria',
    'Palo Negro',
    'El Limón',
    'Ocumare de la Costa',
    'San Casimiro',
    'San Sebastián de los Reyes',
    'Turmero',
    'Las Tejerías',
    'Cagua',
    'Colonia Tovar',
    'Barbacoas',
    'Villa de Cura',
  ],
  Barinas: [
    'Sabaneta',
    'El Cantón',
    'Socopó',
    'Arismendi',
    'Barinas',
    'Barinitas',
    'Barrancas',
    'Santa Bárbara',
    'Obispos',
    'Ciudad Bolivia',
    'Libertad',
    'Ciudad de Nutrias',
  ],
  Bolívar: [
    'Ciudad Piar',
    'Ciudad Guayana',
    'Caicara del Orinoco',
    'El Callao',
    'Santa Elena de Uairén',
    'Ciudad Bolívar',
    'El Palmar',
    'Upata',
    'Guasipati',
    'Tumeremo',
    'Maripa',
  ],
  Carabobo: [
    'Bejuma',
    'Güigüe',
    'Mariara',
    'Guacara',
    'Morón',
    'Tocuyito',
    'Los Guayos',
    'Miranda',
    'Montalbán',
    'Naguanagua',
    'Puerto Cabello',
    'San Diego',
    'San Joaquín',
    'Valencia',
  ],
  Cojedes: [
    'Cojedes',
    'Tinaquillo',
    'El Baúl',
    'Macapo',
    'El Pao',
    'Libertad',
    'Las Vegas',
    'San Carlos',
    'Tinaco',
  ],
  'Delta Amacuro': ['Curiapo', 'Sierra Imataca', 'Pedernales', 'Tucupita'],
  'Distrito Capital': ['Caracas'],
  Falcón: [
    'San Juan de los Cayos',
    'San Luis',
    'Capatárida',
    'Yaracal',
    'Punto Fijo',
    'La Vela de Coro',
    'Dabajuro',
    'Pedregal',
    'Pueblo Nuevo',
    'Churuguara',
    'Jacura',
    'Santa Cruz de Los Taques',
    'Mene de Mauroa',
    'Coro',
    'Chichiriviche',
    'Palmasola',
    'Cabure',
    'Píritu',
    'Mirimire',
    'Tucacas',
    'La Cruz de Taratara',
    'Tocópero',
    'Santa Cruz de Bucaral',
    'Urumaco',
    'Puerto Cumarebo',
  ],
  Guárico: [
    'Camaguán',
    'Chaguaramas',
    'El Socorro',
    'Calabozo',
    'Tucupido',
    'Altagracia de Orituco',
    'San Juan de los Morros',
    'El Sombrero',
    'Las Mercedes',
    'Valle de la Pascua',
    'Ortiz',
    'Zaraza',
    'Guayabal',
    'San José de Guaribe',
    'Santa María de Ipire',
  ],
  'La Guaira': ['La Guaira'],
  Lara: [
    'Sanare',
    'Duaca',
    'Barquisimeto',
    'Quíbor',
    'El Tocuyo',
    'Cabudare',
    'Sarare',
    'Carora',
    'Siquisique',
  ],
  Mérida: [
    'El Vigía',
    'La Azulita',
    'Bailadores',
    'Caja Seca',
    'Canaguá',
    'Capurí',
    'Chachopo',
    'Chiguará',
    'Ejido',
    'El Vigía',
    'La Azulita',
    'Santa Cruz de Mora',
    'Aricagua',
    'Canaguá',
    'Ejido',
    'Tucaní',
    'Santo Domingo',
    'Guaraque',
    'Arapuey',
    'La Playa',
    'Mérida',
    'Timotes',
    'Santa Elena de Arenales',
    'Santa María de Caparo',
    'Pueblo Llano',
    'Mucuchíes',
    'La Morita',
    'Tabay',
    'Lagunillas',
    'Tovar',
    'Nueva Bolivia',
    'Zea',
  ],
  Miranda: [
    'Caucagua',
    'San José de Barlovento',
    'Baruta',
    'Higuerote',
    'Carrizal',
    'Chacao',
    'Charallave',
    'El Hatillo',
    'Los Teques',
    'Santa Teresa del Tuy',
    'Ocumare del Tuy',
    'San Antonio de los Altos',
    'Río Chico',
    'Santa Lucía',
    'Cúpira',
    'Guarenas',
    'San Francisco de Yare',
    'Petare',
    'Cúa',
    'Guatire',
  ],
  Monagas: [
    'San Antonio de Capayacuar',
    'Aguasay',
    'Caripito',
    'Caripe',
    'Caicara',
    'Punta de Mata',
    'Temblador',
    'Maturín',
    'Aragua',
    'Quiriquire',
    'Santa Bárbara',
    'Sotillo',
    'Uracoa',
  ],
  'Nueva Esparta': [
    'La Plaza de Paraguachí',
    'La Asunción',
    'San Juan Bautista',
    'El Valle del Espíritu Santo',
    'Santa Ana',
    'Pampatar',
    'Juan Griego',
    'Porlamar',
    'Boca del Río',
    'Punta de Piedras',
    'Porlamar',
    'Punta de Piedras',
    'San Pedro de Coche',
  ],
  Portuguesa: [
    'Agua Blanca',
    'Araure',
    'Píritu',
    'Guanare',
    'Guanarito',
    'Chabasquén',
    'Ospino',
    'Acarigua',
    'Papelón',
    'Boconoíto',
    'San Rafael de Onoto',
    'El Playón',
    'Biscucuy',
    'Villa Bruzual',
  ],
  Sucre: [
    'Casanay',
    'San José de Aerocuar',
    'Río Caribe',
    'El Pilar',
    'Carúpano',
    'Marigüitar',
    'Yaguaraparo',
    'Araya',
    'Tunapuy',
    'Irapa',
    'San Antonio del Golfo',
    'Cumanacoa',
    'Cariaco',
    'Cumaná',
    'Güiria',
  ],
  Táchira: [
    'Cordero',
    'Las Mesas',
    'Colón',
    'San Antonio del Táchira',
    'Táriba',
    'Santa Ana del Táchira',
    'San Rafael del Piñal',
    'San José de Bolívar',
    'La Fría',
    'Palmira',
    'Capacho Nuevo',
    'La Grita',
    'El Cobre',
    'Rubio',
    'Capacho Viejo',
    'Abejales',
    'Lobatera',
    'Michelena',
    'Coloncito',
    'Ureña',
    'Delicias',
    'La Tendida',
    'San Cristóbal',
    'Umuquena',
    'Seboruco',
    'San Simón',
    'Queniquea',
    'San Josecito',
    'Pregonero',
  ],
  Trujillo: [
    'Santa Isabel',
    'Boconó',
    'Sabana Grande',
    'Chejendé',
    'Carache',
    'Escuque',
    'El Paradero',
    'El Cumbe',
    'Santa Apolonia',
    'El Divino Salvador',
    'Monte Carmelo',
    'Motatán',
    'Pampán',
    'Pampanito',
    'Betijoque',
    'Carvajal',
    'Sabana de Mendoza',
    'Trujillo',
    'La Quebrada',
    'Valera',
  ],
  Yaracuy: [
    'San Pablo',
    'Aroa',
    'Chivacoa',
    'Cocorote',
    'Independencia',
    'Sabana de Parra',
    'Boraure',
    'Yumare',
    'Nirgua',
    'Yaritagua',
    'San Felipe',
    'Guama',
    'Urachiche',
    'Farriar',
  ],
  Zulia: [
    'El Toro',
    'San Timoteo',
    'Cabimas',
    'Encontrados',
    'San Carlos del Zulia',
    'Pueblo Nuevo El Chivo',
    'Sinamaica',
    'La Concepción',
    'Casigua El Cubo',
    'Concepción',
    'Ciudad Ojeda',
    'Machiques',
    'San Rafael de El Moján',
    'Maracaibo',
    'Los Puertos de Altagracia',
    'La Villa del Rosario',
    'San Francisco',
    'Santa Rita',
    'Tía Juana',
    'Bobures',
    'Bachaquero',
  ],
};

const estados = Object.keys(venezuelaData);

interface LocationSelectorProps<T extends FieldValues> {
  control: Control<T>;
  form: UseFormReturn<T>;
  // Usamos Path<T> para asegurar que los nombres de campo pertenezcan al formulario
  estadoFieldName: Path<T>;
  ciudadFieldName: Path<T>;
}

export function LocationSelector<T extends FieldValues>({
  control,
  form,
  estadoFieldName,
  ciudadFieldName,
}: LocationSelectorProps<T>) {
  const { watch, setValue } = form;
  const selectedEstado = watch(estadoFieldName);

  const ciudades = selectedEstado
    ? venezuelaData[selectedEstado as keyof typeof venezuelaData]
    : [];

  // Reinicia el valor de la ciudad cuando el estado cambia
  /*useEffect(() => {
    setValue(ciudadFieldName, '' as PathValue<T, typeof ciudadFieldName>, {
      shouldValidate: false,
    });
  }, [selectedEstado, setValue, ciudadFieldName]);*/

  return (
    <>
      <FormField
        name={estadoFieldName}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado donde se suscribe</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                position="popper"
                className="bg-white z-50 max-h-60 overflow-y-auto text-black"
              >
                {estados.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name={ciudadFieldName}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ciudad donde se suscribe</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!selectedEstado}
            >
              <FormControl>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Seleccione una ciudad" />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                position="popper"
                className="bg-white z-50 max-h-60 overflow-y-auto text-black"
              >
                {ciudades.map((ciudad) => (
                  <SelectItem key={ciudad} value={ciudad}>
                    {ciudad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
