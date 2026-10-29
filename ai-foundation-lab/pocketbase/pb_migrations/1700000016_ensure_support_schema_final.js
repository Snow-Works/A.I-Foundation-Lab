/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sm0000000000001");

  // Remove existing fields to ensure no duplicates
  const fieldsToRemove = [
    "smf000000000001", "smf000000000002", "smf000000000003",
    "smf000000000004", "smf000000000005", "smf000000000006",
    "smf000000000007", "smf000000000008"
  ];

  for (const f of fieldsToRemove) {
    try { collection.schema.removeField(f); } catch (e) {}
  }

  // 1. Student Relation
  collection.schema.addField(new SchemaField({
    system: false, id: "smf000000000001", name: "student", type: "relation", required: true, unique: false,
    options: { collectionId: "pr0000000000001", cascadeDelete: true, minSelect: null, maxSelect: 1, displayFields: null }
  }));

  // 2. Sender ID (Text so it accepts both Student and Admin IDs)
  collection.schema.addField(new SchemaField({
    system: false, id: "smf000000000002", name: "sender_id", type: "text", required: false, unique: false,
    options: { min: null, max: null, pattern: "" }
  }));

  // 3. Sender Type
  collection.schema.addField(new SchemaField({
    system: false, id: "smf000000000003", name: "sender_type", type: "select", required: true, unique: false,
    options: { maxSelect: 1, values: ["student", "admin"] }
  }));

  // 4. Body (Optional so users can just send an image)
  collection.schema.addField(new SchemaField({
    system: false, id: "smf000000000004", name: "body", type: "text", required: false, unique: false,
    options: { min: null, max: 5000, pattern: "" }
  }));

  // 5. Read States
  collection.schema.addField(new SchemaField({
    system: false, id: "smf000000000005", name: "is_read_by_admin", type: "bool", required: false, unique: false, options: {}
  }));
  collection.schema.addField(new SchemaField({
    system: false, id: "smf000000000006", name: "is_read_by_student", type: "bool", required: false, unique: false, options: {}
  }));

  // 6. Attachment (No MIME restrictions to prevent 400 errors)
  collection.schema.addField(new SchemaField({
    system: false, id: "smf000000000007", name: "attachment", type: "file", required: false, unique: false,
    options: { maxSelect: 1, maxSize: 10485760, mimeTypes: [], thumbs: [], protected: false }
  }));

  // 7. Message Type
  collection.schema.addField(new SchemaField({
    system: false, id: "smf000000000008", name: "message_type", type: "select", required: true, unique: false,
    options: { maxSelect: 1, values: ["text", "image", "video", "audio"] }
  }));

  return dao.saveCollection(collection);
}, (db) => { return null; });