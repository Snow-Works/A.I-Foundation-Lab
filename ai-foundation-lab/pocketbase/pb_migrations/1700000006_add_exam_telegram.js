/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);
  const settings = dao.findCollectionByNameOrId("app_settings");

  // Add the Exam Telegram Group URL field
  settings.schema.addField(new SchemaField({
    id: "asf000000000008",
    name: "exam_telegram_group_url",
    type: "text",
    system: false,
    required: false,
    unique: false,
    options: {
      min: null,
      max: 500,
      pattern: "",
    },
  }));

  // Add the Exam Telegram Enabled toggle
  settings.schema.addField(new SchemaField({
    id: "asf000000000009",
    name: "exam_telegram_enabled",
    type: "bool",
    system: false,
    required: false,
    unique: false,
    options: {},
  }));

  dao.saveCollection(settings);
  return null;
}, (db) => {
  const dao = new Dao(db);
  const settings = dao.findCollectionByNameOrId("app_settings");
  
  settings.schema.removeField("asf000000000008");
  settings.schema.removeField("asf000000000009");
  
  dao.saveCollection(settings);
  return null;
});