// import { onAuthStateChanged } from "firebase/auth";
// import { useEffect } from "react";
// import { auth } from "../firebase-config";
// import type { UserContextType } from "../contexts/userContext";
// import TreeContextManager from "../contexts/managers/TreeContextManager";
// import IndexedDBService from "../services/IndexedDBService";
// import type { TreeContextType } from "../contexts/treeContext";
// import type { HistoryContextType } from "../contexts/historyContext";
// import APIService from "../services/APIService";

// export default function useAuthObserver(setUser: UserContextType[1], setTree: TreeContextType[1], setHistory: HistoryContextType[1]) {
//     useEffect(() => {
//         const unsubcribe = onAuthStateChanged(auth, (user) => {
//             try {
//                 if (user) {
//                     console.log("SIGNED IN!");
//                     (async () => {
//                         // const token = await user.getIdToken();
//                         if (user.email) {
//                             // localStorage.setItem("email", user.email);
//                             // await APIService.signInUser(user, token);

//                             const nodes = await IndexedDBService.getNodes(user.email);

//                             const newTree = TreeContextManager.initTree(nodes);

//                             setTree(newTree);
//                         }
//                     })();
//                 }
//                 else {
//                     console.log("SIGNED OUT!");
//                     (async () => {
//                         localStorage.setItem("email", "__LOCAL__");

//                         const nodes = await IndexedDBService.getNodes("__LOCAL__");

//                         const newTree = TreeContextManager.initTree(nodes);

//                         setTree(newTree);
//                     })();
//                 }
//                 setHistory({ newActionStartIndex: 0, actionHistory: [] });
//                 setUser(user);
//             }
//             catch (error) {
//                 console.error(error)
//             }
//         });
//         return unsubcribe;
//     }, [])
// }