/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sm0000000000001");

  // Update attachment field to use Wildcards
  collection.schema.removeField("smf000000000007");
  collection.schema.addField(new SchemaField({
    system: false,
    id: "smf000000000007",
    name: "attachment",
    type: "file",
    required: false,
    unique: false,
    options: {
      maxSelect: 1,
      maxSize: 10485760, // 10MB
      mimeTypes: ["image/*", "video/*", "audio/*"], // Wildcards
      thumbs: [],
      protected: false
    }
  }));

  return dao.saveCollection(collection);
}, (db) => {
  return null;
});