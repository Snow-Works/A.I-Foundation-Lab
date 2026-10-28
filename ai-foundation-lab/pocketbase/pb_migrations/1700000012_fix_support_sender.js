/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sm0000000000001");

  // Remove the strict relation
  collection.schema.removeField("smf000000000002");

  // Add a flexible text field for the sender ID
  collection.schema.addField(new SchemaField({
    system: false,
    id: "smf000000000002",
    name: "sender_id",
    type: "text",
    required: false,
    unique: false,
    options: { min: null, max: null, pattern: "" }
  }));

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sm0000000000001");
  collection.schema.removeField("smf000000000002");
  return dao.saveCollection(collection);
});