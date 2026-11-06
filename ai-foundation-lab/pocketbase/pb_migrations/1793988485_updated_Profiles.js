/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // add field
  collection.fields.addAt(15, new Field({
    "help": "",
    "hidden": false,
    "id": "date1004364573",
    "max": "",
    "min": "",
    "name": "photo_verified_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // remove field
  collection.fields.removeById("date1004364573")

  return app.save(collection)
})
