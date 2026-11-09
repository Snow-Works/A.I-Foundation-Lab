/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_684545007")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.collectionName = \"admins\"",
    "deleteRule": "@request.auth.collectionName = \"admins\"",
    "listRule": "attempt.student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "updateRule": "@request.auth.collectionName = \"admins\"",
    "viewRule": "attempt.student = @request.auth.id || @request.auth.collectionName = \"admins\""
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4287217533",
    "help": "",
    "hidden": false,
    "id": "relation418120294",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "attempt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "qu0000000000001",
    "help": "",
    "hidden": false,
    "id": "relation3069659470",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "question",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "number4113142680",
    "max": null,
    "min": null,
    "name": "order",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "date876511337",
    "max": "",
    "min": "",
    "name": "assigned_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_684545007")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  // remove field
  collection.fields.removeById("relation418120294")

  // remove field
  collection.fields.removeById("relation3069659470")

  // remove field
  collection.fields.removeById("number4113142680")

  // remove field
  collection.fields.removeById("date876511337")

  return app.save(collection)
})
