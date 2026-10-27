/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);
  const settings = dao.findCollectionByNameOrId("app_settings");

  settings.listRule =
    '@request.auth.collectionName = "admins" || (@request.auth.id != "" && @request.auth.photo_verified = true)';
  settings.viewRule = settings.listRule;

  dao.saveCollection(settings);
  return null;
}, (db) => {
  const dao = new Dao(db);
  const settings = dao.findCollectionByNameOrId("app_settings");
  settings.listRule = "";
  settings.viewRule = "";
  dao.saveCollection(settings);
  return null;
});