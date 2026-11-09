/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pr0000000000001")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_pr0000000000001` ON `profiles` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_pr0000000000001` ON `profiles` (`email`) WHERE `email` != ''"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pr0000000000001")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_pr0000000000001` ON `profiles` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_pr0000000000001` ON `profiles` (`email`) WHERE `email` != ''",
      "CREATE INDEX `idx_n9zorjlc7z` ON `profiles` (`dummy`)"
    ]
  }, collection)

  return app.save(collection)
})
