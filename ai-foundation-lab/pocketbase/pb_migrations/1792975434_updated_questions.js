/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qu0000000000001")

  collection.listRule = "@request.auth.collectionName = \"admins\" || @request.auth.id != \"\""
  collection.viewRule = "@request.auth.collectionName = \"admins\" || @request.auth.id != \"\""
  collection.indexes = [
    "CREATE INDEX `idx_questions_difficulty` ON `questions` (`difficulty`)",
    "CREATE INDEX `idx_questions_active` ON `questions` (`active`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qu0000000000001")

  collection.listRule = "@request.auth.collectionName = \"admins\""
  collection.viewRule = "@request.auth.collectionName = \"admins\""
  collection.indexes = [
    "CREATE INDEX idx_questions_difficulty ON questions (difficulty)",
    "CREATE INDEX idx_questions_active ON questions (active)"
  ]

  return dao.saveCollection(collection)
})
