const { Events, SubCategories, Categories } = require("../db.js");
const { v4: uuidv4 } = require("uuid");
const { finder } = require('./events.js')
async function bulkEvents(req, res) {

    let data = { ...req.body };
    try {
        const existentEvents = await finder()

        if (existentEvents.length > 0) return res.send('Ya hay eventos precargados')
        else {
            let valores = Object.values(data);
           
            valores.map(async e=>{

                const createdEvent = await Events.create({
                    id: uuidv4(),
                    name: e.name,
                    artist: e.artist,
                    place: e.place,
                    address: e.address,
                    location: e.location,
                    province: e.province,
                    price: e.price,
                    image: e.image,
                    totalTickets:e.availableTickets,
                    availableTickets: e.availableTickets,
                    date: e.date,
                    time: e.time,
                    isImportant: e.isImportant
                });
                const cat = await Categories.findOne({
                    where: { id: parseInt(e.category) },
                  });
                await createdEvent.addCategories(cat);

                e.subCategories.map(async (genre) => {
                    const [subCat, created] = await SubCategories.findOrCreate({
                        where: {
                          genre: genre,
                          catId:parseInt(e.category)
                        }
                
                      });
                    await createdEvent.addSubCategories(subCat);
                    if (created) {
                        const category = await Categories.findOne({
                            where: {
                                id: e.category
                            }
                        })
                        await category.addSubCategories(subCat)
                    }
                });
            })

            return res.send('Eventos precargados con exito')
        }


    } catch (error) {
        console.log(error);
        res.status(500).send("error al precargar eventos");
    }
}

module.exports = {
    bulkEvents,
};