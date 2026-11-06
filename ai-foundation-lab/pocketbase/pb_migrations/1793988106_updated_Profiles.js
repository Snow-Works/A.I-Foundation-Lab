/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // add field
  collection.fields.addAt(11, new Field({
    "cascadeDelete": false,
    "collectionId": "ad0000000000001",
    "help": "",
    "hidden": false,
    "id": "relation1319357245",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "approved_by",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // remove field
  collection.fields.removeById("relation1319357245")

  return app.save(collection)
})
