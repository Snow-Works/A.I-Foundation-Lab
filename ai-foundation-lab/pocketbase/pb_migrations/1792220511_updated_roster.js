/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ro0000000000001")

  collection.listRule = "@request.auth.collectionName = \"admins\""
  collection.viewRule = "@request.auth.collectionName = \"admins\""
  collection.createRule = "@request.auth.collectionName = \"admins\""
  collection.updateRule = "@request.auth.collectionName = \"admins\""
  collection.deleteRule = "@request.auth.collectionName = \"admins\""
  collection.indexes = [
    "CREATE INDEX `idx_roster_name` ON `roster` (\n  `first_name`,\n  `surname`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ro0000000000001")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null
  collection.indexes = [
    "CREATE INDEX idx_roster_name ON roster (first_name, surname)"
  ]

  return dao.saveCollection(collection)
})
