import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { UserStatus } from "../types/active-user.types";
import requestPermission from "../utils/notification-request";
import userIdle from "../utils/user-idle";

type StartMethodOptions = {
    threshold?: number;
    signal?: AbortSignal;
}

type ActiveUserCtx = { 
    idleThreshold: number;
    permissionDenied: boolean;
    start: (options: StartMethodOptions) => void;
    cleanupTimeout: () => void;
    status: UserStatus;
}

// Create Context
const ActiveUserContext = createContext({} as ActiveUserCtx); 

// Create Custom Hook to Consume Context
export const useActiveUserContext = () => useContext(ActiveUserContext);

// Create Provider

export const ActiveUserProvider = ({ children }: { children: ReactNode}) => {
    const [activityState, setActivityState] = useState<Pick<ActiveUserCtx, "idleThreshold" | "cleanupTimeout" | "status">>({ 
        status: "idle",
        idleThreshold: 0,
        cleanupTimeout: () => null as unknown,
    })
    const [permissionDenied, setPermissionDenied] = useState(true);

    useEffect(() => {
        return () => { 
            activityState.cleanupTimeout();
        }
    }, [activityState.cleanupTimeout])
    
    const handlePermissionDenied = () => setPermissionDenied(true);
    const handlePermissionGranted = (thresholdInput: number | undefined) => { 
        setPermissionDenied(false);
        const { isIdle, destroyTimeout, threshold } = userIdle({ threshold: thresholdInput });
        setActivityState({ ...activityState, ...{
            status: isIdle ? "idle" : "active",
            idleThreshold: threshold,
            cleanupTimeout: destroyTimeout
        }})
    }

    const start = async (options: StartMethodOptions) => {
        const permissionResult = await requestPermission(); 
        permissionResult === "granted" ? handlePermissionGranted(options.threshold) : handlePermissionDenied();
    }

    // return?
    return (
        <ActiveUserContext.Provider value={{ permissionDenied, ...activityState, start }}>
            {children}
        </ActiveUserContext.Provider>
    )
}