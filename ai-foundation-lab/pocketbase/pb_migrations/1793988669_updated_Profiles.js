/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // update collection data
  unmarshal({
    "createRule": "id = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "listRule": "id = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "viewRule": "id = @request.auth.id || @request.auth.collectionName = \"admins\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // update collection data
  unmarshal({
    "createRule": null,
    "listRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
