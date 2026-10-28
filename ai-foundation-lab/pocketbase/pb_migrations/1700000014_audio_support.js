/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sm0000000000001");

  // 1. Update attachment field to allow audio
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
      mimeTypes: [
        "image/jpeg", "image/png", "image/webp", 
        "video/mp4", "video/webm", 
        "audio/webm", "audio/mp4", "audio/mpeg", "audio/ogg"
      ],
      thumbs: [],
      protected: false
    }
  }));

  // 2. Update message_type to include 'audio'
  collection.schema.removeField("smf000000000008");
  collection.schema.addField(new SchemaField({
    system: false,
    id: "smf000000000008",
    name: "message_type",
    type: "select",
    required: true,
    unique: false,
    options: {
      maxSelect: 1,
      values: ["text", "image", "video", "audio"]
    }
  }));

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  // Rollback logic (optional for this specific upgrade, but good practice)
  return dao;
});