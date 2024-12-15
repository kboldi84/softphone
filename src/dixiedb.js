import Dexie from 'dexie';

export const db = new Dexie('nav_endpoints');
db.version(1).stores({
  users: "++id, tasz, rovidszam, varosi_plusz, varosi, email, nev, favorite",
  callList: "++id, call_type, call_interval_start, call_interval_end, peer_connections_local, peer_connections_remote, peer_connection_state_ringing, peer_connection_state_accept, peer_connection_state_cancel, peer_connection_state_bye", 
  favorites: "++id, tasz ",
});
db.open();

 