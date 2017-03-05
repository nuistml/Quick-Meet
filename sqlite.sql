CREATE table event (
  eventid INTEGER PRIMARY KEY,
  startTime INTEGER,
  endTime Integer

);

CREATE table users (
  userid INTEGER PRIMARY KEY,
  url TEXT,
  events TEXT
);

CREATE table group (
  groupid INTEGER PRIMARY KEY,
  groupMember TEXT
);

