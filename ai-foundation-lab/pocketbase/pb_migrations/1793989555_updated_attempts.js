/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287217533")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.collectionName = \"admins\"",
    "listRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "updateRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "viewRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\""
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 0,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "in_progress,",
      " submitted, marked, released, terminated"
    ]
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "date222754019",
    "max": "",
    "min": "",
    "name": "started_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "help": "",
    "hidden": false,
    "id": "date2793705620",
    "max": "",
    "min": "",
    "name": "deadline_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "number1783675470",
    "max": null,
    "min": null,
    "name": "duration_seconds",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "help": "",
    "hidden": false,
    "id": "number662471717",
    "max": null,
    "min": null,
    "name": "violation_count",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "help": "",
    "hidden": false,
    "id": "bool4019923835",
    "name": "auto_terminated",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "help": "",
    "hidden": false,
    "id": "number2070097366",
    "max": null,
    "min": null,
    "name": "score_total",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "help": "",
    "hidden": false,
    "id": "number3940335730",
    "max": null,
    "min": null,
    "name": "score_max",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2704366966",
    "max": 0,
    "min": 0,
    "name": "admin_notes",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287217533")

  // update collection data
  unmarshal({
    "createRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  // remove field
  collection.fields.removeById("select2063623452")

  // remove field
  collection.fields.removeById("date222754019")

  // remove field
  collection.fields.removeById("date2793705620")

  // remove field
  collection.fields.removeById("number1783675470")

  // remove field
  collection.fields.removeById("number662471717")

  // remove field
  collection.fields.removeById("bool4019923835")

  // remove field
  collection.fields.removeById("number2070097366")

  // remove field
  collection.fields.removeById("number3940335730")

  // remove field
  collection.fields.removeById("text2704366966")

  return app.save(collection)
})
