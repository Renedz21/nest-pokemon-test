import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  /**
   *
   */
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async executeSeed() {

    //*INSERCIONES POR LOTE
    //*ESTA PARTE ES UN TEST
    //*PRIMERO BORRAMOS TODA LA DATA
    await this.pokemonModel.deleteMany({});

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    //*CREAMOS UNA VARIABLE DE ARREGLOS

    //*ARRAY DE PROMESAS FORMA 1
    // const insertPromisesArray = []; 

    //*ARRAY DE PROMESAS FORMA 2
    const pokemonToInsert: { name: string, no: number }[] = [];


    data.results.forEach(async ({ name, url }) => {

      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      // const pokemon = await this.pokemonModel.create({ name, no })

      //*PUSH A LA VARIABLE DE ARREGLOS FORMA 1
      // insertPromisesArray.push(this.pokemonModel.create({ name, no }));

      //*PUSH A LA VARIABLE DE ARREGLOS FORMA 2
      pokemonToInsert.push({ name, no });

    });

    //*ESPERAMOS A QUE TODAS LAS PROMESAS SEAN RESUELTAS FORMA 1
    // await Promise.all(insertPromisesArray);

    //*ESPERAMOS A QUE TODAS LAS PROMESAS SEAN RESUELTAS FORMA 2
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Executed';
  }
}
