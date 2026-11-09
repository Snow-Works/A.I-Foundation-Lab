/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("aq0000000000001");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": "@request.auth.collectionName = \"admins\"",
    "deleteRule": "@request.auth.collectionName = \"admins\"",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "at0000000000001",
        "help": "",
        "hidden": false,
        "id": "aqf000000000001",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "attempt",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "qu0000000000001",
        "help": "",
        "hidden": false,
        "id": "aqf000000000002",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "question",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "aqf000000000003",
        "max": null,
        "min": null,
        "name": "order",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "help": "",
        "hidden": false,
        "id": "aqf000000000004",
        "max": "",
        "min": "",
        "name": "assigned_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      }
    ],
    "id": "aq0000000000001",
    "indexes": [],
    "listRule": "attempt.student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "name": "attempt_questions",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.collectionName = \"admins\"",
    "viewRule": "attempt.student = @request.auth.id || @request.auth.collectionName = \"admins\""
  });

  return app.save(collection);
})
