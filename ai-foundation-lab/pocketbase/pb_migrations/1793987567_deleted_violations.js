/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("vi0000000000001");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": "attempt.student = @request.auth.id",
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
        "cascadeDelete": false,
        "collectionId": "at0000000000001",
        "help": "",
        "hidden": false,
        "id": "vif000000000001",
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
        "collectionId": "pr0000000000001",
        "help": "",
        "hidden": false,
        "id": "vif000000000002",
        "maxSelect": 1,
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
        "id": "vif000000000003",
        "max": 0,
        "min": 0,
        "name": "type",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "help": "",
        "hidden": false,
        "id": "vif000000000004",
        "max": "",
        "min": "",
        "name": "occurred_at",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "vif000000000005",
        "maxSize": 0,
        "name": "details",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "vi0000000000001",
    "indexes": [],
    "listRule": "@request.auth.collectionName = \"admins\"",
    "name": "violations",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": "@request.auth.collectionName = \"admins\""
  });

  return app.save(collection);
})
