/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text4222712125",
    "max": 0,
    "min": 0,
    "name": "whatsapp",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // remove field
  collection.fields.removeById("text4222712125")

  return app.save(collection)
})
