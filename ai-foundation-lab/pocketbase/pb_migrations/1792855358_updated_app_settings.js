/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("as0000000000001")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gsvryqjb",
    "name": "telegram_group_url",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xdvdnezx",
    "name": "exam_telegram_enabled",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("as0000000000001")

  // remove
  collection.schema.removeField("gsvryqjb")

  // remove
  collection.schema.removeField("xdvdnezx")

  return dao.saveCollection(collection)
})
