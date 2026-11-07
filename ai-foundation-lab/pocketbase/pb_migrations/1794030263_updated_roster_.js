/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2089037591")

  // update collection data
  unmarshal({
    "name": "rosters"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2089037591")

  // update collection data
  unmarshal({
    "name": "roster_"
  }, collection)

  return app.save(collection)
})
