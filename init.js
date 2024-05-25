// Setup for page settings.

// Set up the drag and drop event for files. Drop won't fire
// without disabling dragover. Might be due to a conflict with
// three.js controls.
export default function initPage() {
    document.addEventListener('dragover', function(event) {
        event.preventDefault()
    });
}