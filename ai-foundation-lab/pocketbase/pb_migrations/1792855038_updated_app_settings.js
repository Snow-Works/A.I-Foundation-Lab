/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("as0000000000001")

  // remove
  collection.schema.removeField("asf000000000008")

  // remove
  collection.schema.removeField("asf000000000009")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "asf000000000001",
    "name": "exam_telegram_group_url",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 500,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("as0000000000001")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "asf000000000008",
    "name": "exam_telegram_group_url",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 500,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "asf000000000009",
    "name": "exam_telegram_enabled",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "asf000000000001",
    "name": "telegram_group_url",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 500,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
