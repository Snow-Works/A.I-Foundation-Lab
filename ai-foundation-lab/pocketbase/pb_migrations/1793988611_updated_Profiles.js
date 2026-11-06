/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // add field
  collection.fields.addAt(19, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text18589324",
    "max": 0,
    "min": 0,
    "name": "notes",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // remove field
  collection.fields.removeById("text18589324")

  return app.save(collection)
})
