/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sm0000000000001");

  // 1. Make body optional (so users can send just an image)
  collection.schema.removeField("smf000000000004");
  collection.schema.addField(new SchemaField({
    system: false,
    id: "smf000000000004",
    name: "body",
    type: "text",
    required: false,
    unique: false,
    options: { min: null, max: 5000, pattern: "" }
  }));

  // 2. Add attachment field (Images & Videos only, max 10MB)
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
      mimeTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"],
      thumbs: [],
      protected: false
    }
  }));

  // 3. Add message type (to know how to render it)
  collection.schema.addField(new SchemaField({
    system: false,
    id: "smf000000000008",
    name: "message_type",
    type: "select",
    required: true,
    unique: false,
    options: {
      maxSelect: 1,
      values: ["text", "image", "video"]
    }
  }));

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sm0000000000001");
  
  collection.schema.removeField("smf000000000007");
  collection.schema.removeField("smf000000000008");
  // Note: We won't revert the body field in this rollback to avoid data loss, 
  // but on a clean DB it would be reverted here.
  
  return dao.saveCollection(collection);
});