//File Nodes generators
function generateFileDivNode(file_id) {
    let file_div_node = document.createElement("div");
    file_div_node.id = "file-div-" + file_id;
    file_div_node.className = "file-div";
    return file_div_node;
}

function generateFileDisplayNode() {
    let file_display_node = document.createElement("div");
    file_display_node.className = "file-display";
    return file_display_node;
}

function generateCropInputField(name, min, max, defualt) {
    let crop_input = document.createElement("input");
    crop_input.type = "number";
    crop_input.id = name;
    crop_input.className = "crop-input";
    crop_input.min = min;
    crop_input.max = max;
    crop_input.value = defualt;
    return crop_input;
}

function generateFormatSidebarNode(file_id, file_name) {
    let format_sidebar_node = document.createElement("div");
    format_sidebar_node.className = "format-sidebar";
    format_sidebar_node.innerHTML += file_name;
    // "remove" button
    let removeButton = document.createElement("button");
    let fi = file_id;
    removeButton.onclick = () => (removeFile(fi));
    removeButton.innerHTML = "Remove File";
    format_sidebar_node.appendChild(removeButton);
    return format_sidebar_node;
}

function generateRefreshButton(parent) {
    let refresh_button = document.createElement("button");
    refresh_button.onclick = () => (parent.reender());
    refresh_button.innerText = "Refresh";
    return refresh_button;
}

function generateBreakeInsideAvoidCheckbox() {
    let break_checkbox_container = document.createElement("div");
    let break_checkbox = document.createElement("input");
    break_checkbox.type = "checkbox";
    break_checkbox.checked = false;
    break_checkbox_container.appendChild(break_checkbox);
    break_checkbox_container.appendChild(document.createTextNode("No split"));
    return break_checkbox_container;
}

function generatePharagraph(text) {
    let p = document.createElement("p");
    p.innerHTML = text;
    return p;
}