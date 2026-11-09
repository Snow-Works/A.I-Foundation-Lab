/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sm0000000000001");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
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
        "cascadeDelete": true,
        "collectionId": "pr0000000000001",
        "help": "",
        "hidden": false,
        "id": "smf000000000001",
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
        "id": "smf000000000002",
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
        "id": "smf000000000003",
        "maxSelect": 1,
        "name": "sender_type",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "student",
          "admin"
        ]
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "smf000000000004",
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
        "id": "smf000000000005",
        "name": "is_read_by_admin",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "help": "",
        "hidden": false,
        "id": "smf000000000006",
        "name": "is_read_by_student",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "help": "",
        "hidden": false,
        "id": "smf000000000007",
        "maxSelect": 1,
        "maxSize": 10485760,
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
        "id": "smf000000000008",
        "maxSelect": 1,
        "name": "message_type",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "text",
          "image",
          "video",
          "audio"
        ]
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
    "id": "sm0000000000001",
    "indexes": [],
    "listRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "name": "support_messages",
    "system": false,
    "type": "base",
    "updateRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "viewRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\""
  });

  return app.save(collection);
})
