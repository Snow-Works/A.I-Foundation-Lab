/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
    const dao = new Dao(db);
    const profiles = dao.findCollectionByNameOrId("pr0000000000001");

    // Add the batch field to profiles
    profiles.schema.addField(new SchemaField({
        id: "prf000000000040",
        name: "batch",
        type: "text",
        system: false,
        required: false,
        unique: false,
        options: { min: null, max: 60, pattern: "" },
    }));

    dao.saveCollection(profiles);
    return null;
}, (db) => {
    const dao = new Dao(db);
    const profiles = dao.findCollectionByNameOrId("pr0000000000001");
    profiles.schema.removeField("prf000000000040");
    dao.saveCollection(profiles);
    return null;
});