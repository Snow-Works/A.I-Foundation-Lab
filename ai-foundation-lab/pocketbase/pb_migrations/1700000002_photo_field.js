/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  const profiles = dao.findCollectionByNameOrId("profiles");

  profiles.schema.addField(new SchemaField({
    id: "prf000000000020",
    name: "photo",
    type: "file",
    system: false,
    required: false,
    unique: false,
    options: {
      maxSelect: 1,
      maxSize: 5242880,
      mimeTypes: ["image/jpeg", "image/png", "image/webp"],
      thumbs: ["256x256", "512x512"],
      protected: false,
    },
  }));

  dao.saveCollection(profiles);

  return null;
}, (db) => {
  const dao = new Dao(db);
  const profiles = dao.findCollectionByNameOrId("profiles");
  profiles.schema.removeField("prf000000000020");
  dao.saveCollection(profiles);
  return null;
});