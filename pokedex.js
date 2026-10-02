sync function buscarPokemon(nombre) {
  const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);

  if (!respuesta.ok) {
    console.log("Algo salió mal. Código:", respuesta.status);
    return null;
  }

  const datos = await respuesta.json();
  return datos;
}

function mostrarFicha(datos) {
  if (!datos) {
    console.log("No hay datos que mostrar");
    return;
  }

  const tipos = datos.types.map(t => t.type.name).join("/");
  console.log("Nombre:", datos.name.toUpperCase(), "ID:", datos.id);
  console.log("Tipos:", tipos);
  console.log("Altura:", datos.height * 10, "cm");
  console.log("Peso:", datos.weight / 10, "kg");

  console.log("Stats:");
  for (const s of datos.stats) {
    console.log(s.stat.name + ":", s.base_stat);
  }

  console.log("Habilidades:");
  for (const a of datos.abilities) {
    console.log(a.ability.name, a.is_hidden ? "(oculta)" : "");
  }
}

function obtenerStat(datos, nombreStat) {
  for (const s of datos.stats) {
    if (s.stat.name === nombreStat) {
      return s.base_stat;
    }
  }
  return null;
}

async function compararPokemon(nombre1, nombre2, stat) {
  const p1 = await buscarPokemon(nombre1);
  const p2 = await buscarPokemon(nombre2);

  if (!p1 || !p2) {
    console.log("No se pudo realizar la comparación");
    return;
  }

  const v1 = obtenerStat(p1, stat);
  const v2 = obtenerStat(p2, stat);

  if (v1 === null || v2 === null) {
    console.log("Stat no válida. Usa: hp, attack, defense, special-attack, special-defense, speed");
    return;
  }

  console.log(p1.name, ":", v1, "|", p2.name, ":", v2);

  if (v1 > v2) {
    console.log("Ganador:", p1.name);
  } else if (v2 > v1) {
    console.log("Ganador:", p2.name);
  } else {
    console.log("Empate");
  }
}

async function pokemonMasFuerte(listaNombres, stat) {
  let mejorNombre = "";
  let mejorValor = -1;

  for (const nombre of listaNombres) {
    const p = await buscarPokemon(nombre);
    if (!p) continue;

    const val = obtenerStat(p, stat);
    if (val !== null && val > mejorValor) {
      mejorValor = val;
      mejorNombre = p.name;
    }
  }

  console.log("Más fuerte en", stat, ":", mejorNombre, "con", mejorValor);
  return mejorNombre;
}

async function iniciar() {
  const p1 = await buscarPokemon("pikachu");
  mostrarFicha(p1);

  await compararPokemon("snorlax", "machamp", "hp");

  const equipo = ["charizard", "blastoise", "snorlax", "gengar", "machamp", "dragonite"];
  const ganador = await pokemonMasFuerte(equipo, "attack");
  
  const datosGanador = await buscarPokemon(ganador);
  mostrarFicha(datosGanador);
}

iniciar();
