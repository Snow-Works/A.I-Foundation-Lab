/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": null,
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
        "cascadeDelete": true,
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
        "id": "text4129600413",
        "max": 0,
        "min": 0,
        "name": "sender_id",
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
        "id": "select1932829178",
        "maxSelect": 0,
        "name": "sender_type",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "student, admin"
        ]
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
        "id": "bool3088172103",
        "name": "is_read_by_admin",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "help": "",
        "hidden": false,
        "id": "bool2479284874",
        "name": "is_read_by_student",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "help": "",
        "hidden": false,
        "id": "file2036324795",
        "maxSelect": 0,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "attachment",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "help": "",
        "hidden": false,
        "id": "select625724656",
        "maxSelect": 0,
        "name": "message_type",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "text, image, video, audio"
        ]
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
    "id": "pbc_1910188844",
    "indexes": [],
    "listRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "name": "support_messages",
    "system": false,
    "type": "base",
    "updateRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "viewRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1910188844");

  return app.delete(collection);
})
