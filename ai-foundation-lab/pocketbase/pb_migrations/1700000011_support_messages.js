/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = new Dao(db);

  const collection = new Collection({
    id: "sm0000000000001",
    name: "support_messages",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "smf000000000001",
        name: "student",
        type: "relation",
        required: true,
        unique: false,
        options: {
          collectionId: "pr0000000000001",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      },
      {
        system: false,
        id: "smf000000000002",
        name: "sender",
        type: "relation",
        required: true,
        unique: false,
        options: {
          collectionId: "pr0000000000001", // Allows both students and admins
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      },
      {
        system: false,
        id: "smf000000000003",
        name: "sender_type",
        type: "select",
        required: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["student", "admin"]
        }
      },
      {
        system: false,
        id: "smf000000000004",
        name: "body",
        type: "text",
        required: true,
        unique: false,
        options: {
          min: 1,
          max: 5000,
          pattern: ""
        }
      },
      {
        system: false,
        id: "smf000000000005",
        name: "is_read_by_admin",
        type: "bool",
        required: false,
        unique: false,
        options: {}
      },
      {
        system: false,
        id: "smf000000000006",
        name: "is_read_by_student",
        type: "bool",
        required: false,
        unique: false,
        options: {}
      }
    ],
    indexes: [
      "CREATE INDEX idx_support_student ON support_messages (student)",
      "CREATE INDEX idx_support_created ON support_messages (created)"
    ],
    listRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"',
    viewRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"',
    createRule: '@request.auth.id != ""',
    updateRule: 'student = @request.auth.id || @request.auth.collectionName = "admins"',
    deleteRule: '@request.auth.collectionName = "admins"',
    options: {}
  });

  dao.saveCollection(collection);
  return null;
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sm0000000000001");
  dao.deleteCollection(collection);
  return null;
});