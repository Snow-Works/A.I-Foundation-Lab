/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("ma0000000000001");

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
        "collectionId": "aq0000000000001",
        "help": "",
        "hidden": false,
        "id": "maf000000000001",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "attempt_question",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "maf000000000002",
        "max": null,
        "min": null,
        "name": "score",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "help": "",
        "hidden": false,
        "id": "maf000000000003",
        "max": null,
        "min": null,
        "name": "max_score",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "maf000000000004",
        "max": 0,
        "min": 0,
        "name": "comment",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "ad0000000000001",
        "help": "",
        "hidden": false,
        "id": "maf000000000005",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "marked_by",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "maf000000000006",
        "max": "",
        "min": "",
        "name": "marked_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "maf000000000007",
        "name": "released",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text1341452863",
        "max": 0,
        "min": 0,
        "name": "dummy",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      }
    ],
    "id": "ma0000000000001",
    "indexes": [],
    "listRule": "attempt_question.attempt.student = @request.auth.id && attempt_question.attempt.status = \"released\" || @request.auth.collectionName = \"admins\"",
    "name": "marks",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.collectionName = \"admins\"",
    "viewRule": "attempt_question.attempt.student = @request.auth.id && attempt_question.attempt.status = \"released\" || @request.auth.collectionName = \"admins\""
  });

  return app.save(collection);
})
