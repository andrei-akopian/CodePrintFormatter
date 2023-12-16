let fileID = 0;

const Title = document.getElementById("page-title");
const Author = document.getElementById("author");
const datetime = document.getElementById("datetime");
const fileDisplay = document.getElementById("file-display");
const fileInput = document.getElementById("file-input");
const settings = document.getElementById("settings");
const tabSize = document.getElementById("tab-size");
const frontCrop = document.getElementById("front-crop");
const backCrop = document.getElementById("back-crop");
const fontSize = document.getElementById("font-size");

added_files = []

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

function generateFormatSidebarNode(file_id) {
    let format_sidebar_node = document.createElement("div");
    format_sidebar_node.className = "format-sidebar";
    format_sidebar_node.textContent = "Hello, " + file_id;
    // remove button
    let removeButton = document.createElement("button");
    let fi = file_id;
    removeButton.onclick = () => (removeFile(fi));
    removeButton.innerHTML = "Remove File";
    format_sidebar_node.appendChild(removeButton);
    return format_sidebar_node;
}


class addedFile {
    reender() {
        this.file_display_node.innerHTML = formatfile(this.file_name, this.content);
    }
    hide_sidebar() {
        this.file_sidebar_node.style.display = "none"
    }
    show_sidebar() {
        this.file_sidebar_node.style.display = "block"
    }
    constructor(file, read_file, file_id) {
        this.file = file;
        this.file_id = file_id;
        this.file_name = file.name;
        this.front_crop = frontCrop.value;
        this.back_crop = backCrop.value;
        this.content = read_file.target.result;
        this.file_div_node;
        this.file_display_node;
        this.file_sidebar_node;
        // put on screen
        // div node
        this.file_div_node = generateFileDivNode(file_id);
        fileDisplay.appendChild(this.file_div_node);
        // display node
        this.file_display_node = generateFileDisplayNode();
        this.file_div_node.appendChild(this.file_display_node);
        // sidebar node
        this.file_sidebar_node = generateFormatSidebarNode(file_id);
        this.file_div_node.appendChild(this.file_sidebar_node);
        // display text
        this.reender();
        fileID += 1;
    }
}

fontSize.addEventListener("change", (e) => {
    fileDisplay.style.fontSize = fontSize.value + "px";
});

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    processFile(file);
    fileInput.value = "";
});

function processFile(file) {
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            let added_file = new addedFile(file, e, fileID);
            added_file.reender();
            added_files.push(added_file);
        };
    }
}

function printFileOutput() {
    settings.style.display = "none";
    for (added_file of added_files) {
        added_file.hide_sidebar();
    }
    print();
    for (added_file of added_files) {
        added_file.show_sidebar();
    }
    settings.style.display = "block";
}

function setAuthor() {
    var name = prompt("Enter your name:");
    Author.innerHTML = name;
}

function setTitle() {
    var title = prompt("Decide a Title for your Document:");
    Title.innerHTML = title;
}

function setDate() {
    var date = prompt("Enter date for your document (leave blank for default/reset):");
    if (date === "") {
        date = Date(); //TODO: add more options to here
    }
    datetime.innerHTML = date;
}

function resetFiles() {
    output = "";
    fileDisplay.innerHTML = "";
}

function removeFile(fileN) {
    var file = document.getElementById("file-div-" + fileN);
    if (file != null) {
        file.remove();
    }
}

// text formatting function
function formatfile(file_name, content) {
    var mod = content.split("\n");
    var output = "<strong>" + file_name + "</strong>";
    var line_n_len = Math.floor(Math.log10(mod.length));
    for (var i = frontCrop.value; i < mod.length - backCrop.value; i++) {
        let line_number = i - frontCrop.value + 1;
        output += "<br>" + "&nbsp;".repeat(line_n_len + 1 - line_number.toString().length) + line_number + "|    " + replace_leading_whitespaces_simple(replace_reserved(mod[i]));
    }
    return output + "<br><br>"; //TODO: adjustable breaks between spaces.
}

function replace_reserved(string) {
    return string.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function replace_leading_whitespaces_simple(string) {
    let whitespaces = string.match(/[\t\s]*/)[0];
    let len = whitespaces.length;
    string = whitespaces.replace(/\s/g, "&nbsp".repeat(tabSize.value)) + string.slice(len);
    return string;
}