function getElementByXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function maxbitrate_set() {
    window.dispatchEvent(new KeyboardEvent('keydown', {
        keyCode: 83,
        ctrlKey: true,
        altKey: true,
        shiftKey: true,
    }));

    const VIDEO_SELECT = getElementByXPath("//div[text()='Video Bitrate']");
    const AUDIO_SELECT = getElementByXPath("//div[text()='Audio Bitrate']");
    const BUTTON = getElementByXPath("//button[text()='Override']");

    if (!(VIDEO_SELECT && AUDIO_SELECT && BUTTON)){
        return false;
    }

    [VIDEO_SELECT, AUDIO_SELECT].forEach(function (el) {
        let parent = el.parentElement;

        let options = parent.querySelectorAll('select > option');

        for (var i = 0; i < options.length - 1; i++) {
            options[i].removeAttribute('selected');
        }

        options[options.length - 1].setAttribute('selected', 'selected');
    });

    // attempt to click the button immediately
    BUTTON.click();

    return true;
}

function maxbitrate_hide(attempts) {
    // console.log("hide");
    const overrideButton = getElementByXPath("//button[text()='Override']");

    if (overrideButton) {
        overrideButton.click();
    } else if (attempts > 0) {
        setTimeout(() => maxbitrate_hide(attempts - 1), 200);
    }
}

function maxbitrate_run() {
    // console.log("run");
    if (!maxbitrate_set()) {
        setTimeout(maxbitrate_run, 100);
    } else {
        maxbitrate_hide(10);
    }
}

const WATCH_REGEXP = /netflix.com\/watch\/.*/;

let oldLocation;

if(globalOptions.setMaxBitrate) {
    console.log("netflix_max_bitrate.js enabled");
    setInterval(function () {
        let newLocation = window.location.toString();

        if (newLocation !== oldLocation) {
            // console.log("detected navigation");

            oldLocation = newLocation;
            if (WATCH_REGEXP.test(newLocation)) {
                maxbitrate_run();
            }
        }
    }, 500);
}
