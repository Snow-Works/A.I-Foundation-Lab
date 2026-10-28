/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
    const dao = new Dao(db);
    const profiles = dao.findCollectionByNameOrId("profiles");

    // 1. Add the field
    profiles.schema.addField(new SchemaField({
        id: "prf000000000030",
        name: "resets_remaining",
        type: "number",
        system: false,
        required: false,
        unique: false,
        options: { min: 0, max: null, noDecimal: true },
    }));

    dao.saveCollection(profiles);

    // 2. Backfill all existing students with 3 resets
    const allProfiles = dao.findRecordsByFilter("profiles", "", "", 0, 0);
    for (const p of allProfiles) {
        const current = p.get("resets_remaining");
        if (current === null || current === 0) {
            p.set("resets_remaining", 3);
            dao.saveRecord(p);
        }
    }

    return null;
}, (db) => {
    const dao = new Dao(db);
    const profiles = dao.findCollectionByNameOrId("profiles");
    profiles.schema.removeField("prf000000000030");
    dao.saveCollection(profiles);
    return null;
});