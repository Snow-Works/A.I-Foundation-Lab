/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ma0000000000001")

  collection.listRule = "attempt_question.attempt.student = @request.auth.id && attempt_question.attempt.status = \"released\" || @request.auth.collectionName = \"admins\""
  collection.viewRule = "attempt_question.attempt.student = @request.auth.id && attempt_question.attempt.status = \"released\" || @request.auth.collectionName = \"admins\""
  collection.indexes = [
    "CREATE INDEX `idx_marks_attempt_question` ON `marks` (`attempt_question`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ma0000000000001")

  collection.listRule = "@request.auth.collectionName = \"admins\""
  collection.viewRule = "@request.auth.collectionName = \"admins\""
  collection.indexes = [
    "CREATE INDEX idx_marks_attempt_question ON marks (attempt_question)"
  ]

  return dao.saveCollection(collection)
})
