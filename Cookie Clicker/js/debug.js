var debug = true;

function testNotification() {
    new Notification("Test Title", "Test Desc");
}

function unlockAll() {
    for (var i = 0; i < buildings.length; i++) {
        buildings[i].unlocked = true
    }
}