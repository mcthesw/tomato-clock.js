PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE UserData(
    ID INTEGER PRIMARY KEY AUTOINCREMENT    NOT NULL UNIQUE,
    NAME           TEXT   NOT NULL,
    PWD            TEXT   NOT NULL,
    TIME           INT DEFAULT 0,
    WINS           INT DEFAULT 0,
    FAILS          INT DEFAULT 0
);
CREATE TABLE Logs(
    TIME           TEXT   NOT NULL,
    NAME           TEXT   NOT NULL,
    IP             TEXT   NOT NULL,
    OPERATION      TEXT   NOT NULL,
    FLAG           INT,
    MSG            TEXT
);
COMMIT;
