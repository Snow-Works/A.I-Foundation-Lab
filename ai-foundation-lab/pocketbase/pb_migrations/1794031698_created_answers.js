/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "student = @request.auth.id",
    "deleteRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"\n\n",
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
        "collectionId": "pbc_4287217533",
        "help": "",
        "hidden": false,
        "id": "relation418120294",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "attempt",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "qu0000000000001",
        "help": "",
        "hidden": false,
        "id": "relation3069659470",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "question",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1210722024",
        "help": "",
        "hidden": false,
        "id": "relation3072569139",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "student",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3685223346",
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
        "id": "bool176190948",
        "name": "is_draft",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "help": "",
        "hidden": false,
        "id": "date830654268",
        "max": "",
        "min": "",
        "name": "submitted_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_3246635500",
    "indexes": [],
    "listRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "name": "answers",
    "system": false,
    "type": "base",
    "updateRule": "student = @request.auth.id",
    "viewRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3246635500");

  return app.delete(collection);
})
