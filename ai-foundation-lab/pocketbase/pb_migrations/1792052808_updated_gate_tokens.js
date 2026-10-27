/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gt0000000000001")

  collection.listRule = "id != \"\""
  collection.viewRule = "id != \"\""
  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_gate_tokens_token` ON `gate_tokens` (`token`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gt0000000000001")

  collection.listRule = null
  collection.viewRule = ""
  collection.indexes = [
    "CREATE UNIQUE INDEX idx_gate_tokens_token ON gate_tokens (token)"
  ]

  return dao.saveCollection(collection)
})
