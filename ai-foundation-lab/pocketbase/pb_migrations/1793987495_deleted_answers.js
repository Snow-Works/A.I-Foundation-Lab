/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("an0000000000001");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": "student = @request.auth.id",
    "deleteRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
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
        "id": "anf000000000001",
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
        "id": "anf000000000002",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "question",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pr0000000000001",
        "help": "",
        "hidden": false,
        "id": "anf000000000003",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "student",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "anf000000000004",
        "max": 0,
        "min": 0,
        "name": "body",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "help": "",
        "hidden": false,
        "id": "anf000000000005",
        "name": "is_draft",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "help": "",
        "hidden": false,
        "id": "anf000000000006",
        "max": "",
        "min": "",
        "name": "saved_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "anf000000000007",
        "max": "",
        "min": "",
        "name": "submitted_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      }
    ],
    "id": "an0000000000001",
    "indexes": [],
    "listRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "name": "answers",
    "system": false,
    "type": "base",
    "updateRule": "student = @request.auth.id",
    "viewRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\""
  });

  return app.save(collection);
})
