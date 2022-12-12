// track progress on https://developer.chrome.com/articles/idle-detection/
// https://developer.mozilla.org/en-US/docs/Web/API/IdleDetector
// https://wicg.github.io/idle-detection/

const DEFEAULT_THRESHOLD = 1000 * 60 * 10; // 10 minutes 🤷‍♀️

type Parameters = { 
    threshold?: number;
}
const userIdle = ({ threshold = DEFEAULT_THRESHOLD }: Parameters) => { 
    let timeoutId: string | number | NodeJS.Timeout | undefined;
    let isIdle = false;

    const setIsInactive = () => { 
        isIdle = true;
    }
    const resetTimeout = () => { 
        clearTimeout(timeoutId);
        timeoutId = setTimeout(setIsInactive, threshold)
    }

    const destroyTimeout = () => clearTimeout(timeoutId);
    // events
    window.onload = resetTimeout;
    window.onclick = resetTimeout;
    window.onkeypress = resetTimeout;
    window.ontouchstart = resetTimeout;
    window.onmousemove = resetTimeout;
    window.onmousedown = resetTimeout;
    window.addEventListener('scroll', resetTimeout, true);

    return { isIdle, destroyTimeout, threshold };
}

export default userIdle;