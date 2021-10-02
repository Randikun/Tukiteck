const { Events, Categories, SubCategories } = require('../db');


async function dataParseada(){
    const dataBase = await Events.findAll({
        include: [
          {
            model: Categories,
            through: {
              attributes: [],
            },
          },

          {
            model: SubCategories,
            through: {
              attributes: [],
            },
          },
        ],
      });
      if (dataBase.length > 0) {
        const eventDb = dataBase.map((result) => {
          return {
            name: result.name,
            id: result.id,
            category: result.categories.map((cat) => cat.id),
            subCategories: result.subCategories,
            artist: result.artist,
            place: result.place,
            address: result.address,
            image: result.image,
            price: result.price,
            availableTickets: result.availableTickets,
            date: result.date,
            time: result.time,
          };
        });
    return eventDb;
    }
}


async function filtroCategories (req, res, next){

    let {id} =req.query
      
    try {
       
        const eventDb = await dataParseada();

        
       
        const filtrados = [];

        eventDb.map(e => e.category[0] === id ? filtrados.push(e) : null );

        filtrados.length > 0 ? res.send(filtrados) : res.send('No hay filtrados de esa categoria')

        }catch(error){
            next(error)
        }

    }


async function filtroSubCategories(req, res, next){

    let {genre} = req.query

    try {
        
        const eventDb = await dataParseada();
        const filtrados = [];

        eventDb.map(e => e.subCategories.map( s => s.genre.toLowerCase() === genre.toLowerCase() ? filtrados.push(e) : null ) )

        filtrados.length > 0 ? res.send(filtrados) : res.send('No hay eventos de ese genero') 

    } catch (error) {
        next(error)
    }
}


async function filtroLocalidad(req, res, next){

  let {localidad, provincia} = req.query;

  try {
    
    const eventDb = await dataParseada();
    const filtrados = [];

    eventDb.map(e => e.address.split(", ")[1].toLowerCase() === localidad ? filtrados.push(e) :  e.address.split(", ")[2].toLowerCase() === provincia ? filtrados.push(e) :  null)

    filtrados.length > 0 ? res.send(filtrados) : res.send('No hay eventos en esa localidad o provincia')

  } catch (error) {
      next(error)
  }

}

async function filtroFecha(req, res, next){

  let {date} = req.query;
  let splited = date.split("/")[2];

  try {
    
    const eventDb = await dataParseada();
    const filtrados = [];

    eventDb.map(e => e.date.split("/")[2] === splited ? filtrados.push(e) : null)

    filtrados.length > 0 ? res.send(filtrados) : res.send('No hay eventos en esa fecha')

  } catch (error) {
      next(error)
  }

}


module.exports = {
    filtroCategories,
    filtroSubCategories,
    filtroLocalidad,
    filtroFecha
}
