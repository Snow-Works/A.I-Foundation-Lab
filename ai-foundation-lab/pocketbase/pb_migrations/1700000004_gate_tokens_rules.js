/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);
  const roster = dao.findCollectionByNameOrId("roster");

  roster.listRule = '@request.auth.collectionName = "admins"';
  roster.viewRule = '@request.auth.collectionName = "admins"';
  roster.createRule = '@request.auth.collectionName = "admins"';
  roster.updateRule = '@request.auth.collectionName = "admins"';
  roster.deleteRule = '@request.auth.collectionName = "admins"';

  dao.saveCollection(roster);
  return null;
}, (db) => {
  const dao = new Dao(db);
  const roster = dao.findCollectionByNameOrId("roster");
  roster.listRule = null;
  roster.viewRule = null;
  roster.createRule = null;
  roster.updateRule = null;
  roster.deleteRule = null;
  dao.saveCollection(roster);
  return null;
});