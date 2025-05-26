-- Up

CREATE TABLE Tags(
    id INTEGER PRIMARY KEY,
    tag TEXT,
    embedX FLOAT,
    embedY FLOAT,
    counts INTEGER
);

CREATE TABLE SourcesTags(
    sourceId INTEGER,
    tagId INTEGER,
    FOREIGN KEY (sourceId) REFERENCES Sources(id),
    FOREIGN KEY (tagId) REFERENCES Tags(id),
    PRIMARY KEY (sourceId, tagId)
);

-- Down

DROP TABLE Tags;
DROP TABLE SourcesTags;
