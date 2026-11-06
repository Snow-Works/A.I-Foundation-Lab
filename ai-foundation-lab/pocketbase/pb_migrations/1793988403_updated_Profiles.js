/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // add field
  collection.fields.addAt(13, new Field({
    "help": "",
    "hidden": false,
    "id": "file347571224",
    "maxSelect": 0,
    "maxSize": 0,
    "mimeTypes": [
      "image/png",
      "image/webp",
      "image/jpeg"
    ],
    "name": "photo",
    "presentable": false,
    "protected": true,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // remove field
  collection.fields.removeById("file347571224")

  return app.save(collection)
})
