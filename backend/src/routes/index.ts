import {
  getTokenAll,
  generateTokenCard,
  recoverCardData,
} from "../controllers/TokenController";

const routes = {
  "GET /": getTokenAll,
  "POST /token": generateTokenCard,
  "POST /token/data": recoverCardData,
};

export default routes;
