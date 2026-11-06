/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("at0000000000001");

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
        "collectionId": "pr0000000000001",
        "help": "",
        "hidden": false,
        "id": "atf000000000001",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "student",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "bp0000000000001",
        "help": "",
        "hidden": false,
        "id": "atf000000000002",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "blueprint",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "atf000000000003",
        "maxSelect": 1,
        "name": "status",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "in_progress",
          "submitted",
          "marked",
          "released",
          "terminated"
        ]
      },
      {
        "help": "",
        "hidden": false,
        "id": "atf000000000004",
        "max": "",
        "min": "",
        "name": "started_at",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "atf000000000005",
        "max": "",
        "min": "",
        "name": "submitted_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "atf000000000006",
        "max": "",
        "min": "",
        "name": "deadline_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "atf000000000007",
        "max": null,
        "min": null,
        "name": "duration_seconds",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "help": "",
        "hidden": false,
        "id": "atf000000000008",
        "max": null,
        "min": null,
        "name": "violation_count",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "help": "",
        "hidden": false,
        "id": "atf000000000009",
        "name": "auto_terminated",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "help": "",
        "hidden": false,
        "id": "atf000000000010",
        "max": null,
        "min": null,
        "name": "score_total",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "help": "",
        "hidden": false,
        "id": "atf000000000011",
        "max": null,
        "min": null,
        "name": "score_max",
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
        "id": "atf000000000012",
        "max": 0,
        "min": 0,
        "name": "admin_notes",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
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
    "id": "at0000000000001",
    "indexes": [],
    "listRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "name": "attempts",
    "system": false,
    "type": "base",
    "updateRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\"",
    "viewRule": "student = @request.auth.id || @request.auth.collectionName = \"admins\""
  });

  return app.save(collection);
})
