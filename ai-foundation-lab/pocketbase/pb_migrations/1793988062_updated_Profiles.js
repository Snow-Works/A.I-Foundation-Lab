/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // add field
  collection.fields.addAt(10, new Field({
    "help": "",
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 0,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "REGISTERED, EMAIL_VERIFIED, APPROVED, PHOTO_VERIFIED, COMMUNITY_UNLOCKED, IDENTITY_CONFIRMED, EXAM_IN_PROGRESS, SUBMITTED, MARKED, REJECTED"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1210722024")

  // remove field
  collection.fields.removeById("select2063623452")

  return app.save(collection)
})
