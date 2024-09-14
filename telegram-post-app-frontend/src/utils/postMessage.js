export function openLinkModal() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        this.selectedRange = selection.getRangeAt(0);
        const selectedText = selection.toString();
        document.getElementById('selected-text').value = selectedText;
        const linkModal = new bootstrap.Modal(document.getElementById('linkModal'));
        linkModal.show();
    } else {
        alert('Пожалуйста, выберите текст, чтобы добавить ссылку.');
    }
}

export function insertLink() {
    const url = document.getElementById('link-url').value;
    const selectedText = document.getElementById('selected-text').value;

    if (!url || !selectedText) {
        alert('Пожалуйста, введите корректную ссылку.');
        return;
    }

    const linkNode = document.createElement('a');
    linkNode.href = url;
    linkNode.textContent = selectedText;

    if (this.selectedRange) {
        this.selectedRange.deleteContents();
        this.selectedRange.insertNode(linkNode);
    }

    const linkModal = bootstrap.Modal.getInstance(document.getElementById('linkModal'));
    linkModal.hide();
}
