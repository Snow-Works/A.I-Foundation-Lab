/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("gt0000000000001")

  // update collection data
  unmarshal({
    "name": "gate_tokens"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("gt0000000000001")

  // update collection data
  unmarshal({
    "name": "max_uses"
  }, collection)

  return app.save(collection)
})
