/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pr0000000000001")

  collection.options = {
    "allowEmailAuth": true,
    "allowOAuth2Auth": false,
    "allowUsernameAuth": false,
    "exceptEmailDomains": null,
    "manageRule": null,
    "minPasswordLength": 8,
    "onlyEmailDomains": null,
    "onlyVerified": true,
    "requireEmail": true
  }
  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_profiles_email` ON `profiles` (`email`)",
    "CREATE INDEX `idx_profiles_status` ON `profiles` (`status`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("pr0000000000001")

  collection.options = {
    "allowEmailAuth": true,
    "allowOAuth2Auth": false,
    "allowUsernameAuth": false,
    "minPasswordLength": 8,
    "requireEmail": true
  }
  collection.indexes = [
    "CREATE UNIQUE INDEX idx_profiles_email ON profiles (email)",
    "CREATE INDEX idx_profiles_status ON profiles (status)"
  ]

  return dao.saveCollection(collection)
})
