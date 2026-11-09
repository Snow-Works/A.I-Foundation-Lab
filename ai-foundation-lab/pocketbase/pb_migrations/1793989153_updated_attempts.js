/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287217533")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1210722024",
    "help": "",
    "hidden": false,
    "id": "relation3072569139",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "student",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "bp0000000000001",
    "help": "",
    "hidden": false,
    "id": "relation642114150",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "blueprint",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287217533")

  // remove field
  collection.fields.removeById("relation3072569139")

  // remove field
  collection.fields.removeById("relation642114150")

  return app.save(collection)
})
