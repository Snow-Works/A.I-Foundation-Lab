/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("at0000000000001")

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1341452863",
    "max": 0,
    "min": 0,
    "name": "dummy",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("at0000000000001")

  // remove field
  collection.fields.removeById("text1341452863")

  return app.save(collection)
})
