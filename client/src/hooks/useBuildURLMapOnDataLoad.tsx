import type Game from "../classes/Game";
import type Profile from "../classes/Profile";
import type Subject from "../classes/Subject";
import type TreeNode from "../classes/TreeNode";
import type { URLMapContextType, URLMapStateType } from "../context";

export default function useBuildURLMapOnDataLoad(games: Game[], urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1]) {

    const deepCopyURLMap: URLMapStateType = new Map();
    urlMap.forEach((value, key) => {
        deepCopyURLMap.set(key, value);
    });

    function buildURLMap(treeNode: TreeNode, ...parentIDS: string[]) {
        console.log(treeNode);
        if (treeNode.type == "death") {
            return;
        }

        else if (treeNode.type == "subject") {
            const subject = treeNode as Subject;
            deepCopyURLMap.set(treeNode.path, {
                gameID: parentIDS[0],
                profileID: parentIDS[1],
                subjectID: treeNode.id
            });
            for (let i = 0; i < subject.items.length; i++){
                buildURLMap(subject.items[i])
            }

        }

        else if (treeNode.type == "profile") {
            const profile = treeNode as Profile;
            deepCopyURLMap.set(treeNode.path, {
                gameID: parentIDS[0],
                profileID: profile.id,
                subjectID: ""
            });
            for (let i = 0; i < profile.items.length; i++){
                buildURLMap(profile.items[i], parentIDS[0], profile.id)
            }
        }

        else {
            const game = treeNode as Game;
            deepCopyURLMap.set(treeNode.path, {
                gameID: game.id,
                profileID: "",
                subjectID: ""
            });
            for (let i = 0; i < game.items.length; i++){
                buildURLMap(game.items[i], game.id)
            }
        }

    }


    for (let i = 0; i < games.length; i++){
        buildURLMap(games[i]);
    }
    



    setURLMap(deepCopyURLMap);
}