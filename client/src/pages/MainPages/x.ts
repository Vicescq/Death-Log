function handleDeathCount(
        subject: Subject,
        deathType: DeathType,
        operation: DeathCountOperation,
    ) {
        let updatedSubject: Subject = { ...subject };
        if (operation == "add") {
            deathType == "fullTries"
                ? updatedSubject.fullTries++
                : updatedSubject.resets++;
        } else {
            deathType == "fullTries"
                ? updatedSubject.fullTries--
                : updatedSubject.resets--;
        }
        updatedSubject.fullTries < 0 ? (updatedSubject.fullTries = 0) : null;
        updatedSubject.resets < 0 ? (updatedSubject.resets = 0) : null;

        // memory data structures
        const { updatedTree: updatedTreeIP, action: actionUpdateSelf } =
            TreeContextManager.updateNode(tree, updatedSubject);
        const { updatedTree, action: actionUpdateParent } =
            TreeContextManager.updateNodeParent(
                updatedSubject,
                updatedTreeIP,
                "update",
            );
        const updatedHistory = HistoryContextManager.updateActionHistory(
            history,
            [actionUpdateSelf, actionUpdateParent],
        );

        // db's
        try {
            IndexedDBService.updateNode(
                actionUpdateSelf.targets,
                localStorage.getItem("email")!,
            );
            IndexedDBService.updateNode(
                actionUpdateParent.targets,
                localStorage.getItem("email")!,
            );
        } catch (error) {
            console.error(error);
        }

        setTree(updatedTree);
        setHistory(updatedHistory);
    }