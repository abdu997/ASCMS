export function apiRoute(auth, name){
  const hostname = window.location.hostname;
  const route = auth + "/" + name;
  if(hostname === "localhost"){
    return "http://localhost/ascms/api/" + route;
  } else {
    return "https://" + hostname + "/api/" + route;
  }
}
