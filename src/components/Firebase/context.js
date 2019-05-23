import React from "react";

/**
 * Provide a given firebase instance to everywhere in the app
 * through React's Context API
 */
const FirebaseContext = React.createContext(null);

export default FirebaseContext;
