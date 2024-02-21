let fileID = 0;
// TODO: add drag and drop for file input
const Title = document.getElementById("page-title");
const Author = document.getElementById("author");
const datetime = document.getElementById("datetime");
const fileDisplay = document.getElementById("file-display");
const fileInput = document.getElementById("file-input");
const settings = document.getElementById("settings");
const tabSize = document.getElementById("tab-size");
const fontSize = document.getElementById("font-size");

added_files = []

class addedFile {
    reender() {
        this.file_display_node.innerHTML = formatfile(this.file_name, this.content, this.front_crop.value, this.back_crop.value);
        this.refreshBreakAvoid();
    }
    refreshBreakAvoid() {
        let state = this.file_div_node.classList.contains("break-avoid");
        let goal = this.break_avoid.children[0].checked;
        if (state != goal) {
            this.file_div_node.classList.toggle("break-avoid");
        }
    }
    constructor(file, read_file, file_id) {
        this.file = file;
        this.file_id = file_id;
        this.file_name = file.name;
        this.content = read_file.target.result.split("\n"); // list split at newlines
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
        this.file_sidebar_node = generateFormatSidebarNode(this.file_id, this.file_name);
        this.file_div_node.appendChild(this.file_sidebar_node);
        // sidebar components
        this.file_sidebar_node.appendChild(generateRefreshButton(this));
        this.front_crop = generateCropInputField("front-crop-" + this.file_id, 0, 200, 0); //TODO: add input validation
        this.back_crop = generateCropInputField("back-crop-" + this.file_id, 0, 200, 0);
        this.break_avoid = generateBreakeInsideAvoidCheckbox();
        this.file_sidebar_node.appendChild(generatePharagraph("Front Crop:"));
        this.file_sidebar_node.appendChild(this.front_crop);
        this.file_sidebar_node.appendChild(generatePharagraph("Back Crop:"));
        this.file_sidebar_node.appendChild(this.back_crop);
        this.file_sidebar_node.appendChild(this.break_avoid);
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

// * printing
function printFileOutput() {
    refreshAll();
    print();
}

addEventListener("beforeprint", (event) => {
    refreshAll();
});

// * settings

function refreshAll() {
    for (added_file of added_files) {
        added_file.reender();
    }
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
    let date = new Date();
    let formatted_date;
    var user_input = prompt(`Enter a date for your document:
    You can choose one of the following quick options (enter number or name) or enter your own cleartext*:
        1. Full: ${date.toString()}
        2. Date: ${date.toDateString()}
        3. Local: ${date.toLocaleString()} <- recommended
        4. Local Date: ${date.toLocaleDateString()}
        5. GMT: ${date.toGMTString()}
        6. UTC: ${date.toUTCString()}
        7. ISO: ${date.toISOString()}
    * If any issues arrise with pure cleartext, put a ! infront: !Today`);
    // logic to pic the right date format
    // ? maybe add case insensitivity
    let len = user_input.length;
    let lenIs1 = len === 1;
    let char0 = user_input[0];
    if (len > 0) {
        if (char0 === "!") {
            formatted_date = user_input.slice(1);
        } else if ((lenIs1 && char0 === "1") || user_input === "Full") {
            formatted_date = date.toString();
        } else if ((lenIs1 && char0 === "2") || user_input === "Date") {
            formatted_date = date.toDateString();
        } else if ((lenIs1 && char0 === "3") || user_input === "Local") {
            formatted_date = date.toLocaleString();
        } else if ((lenIs1 && char0 === "4") || user_input === "Local Date") {
            formatted_date = date.toLocaleDateString();
        } else if ((lenIs1 && char0 === "5") || user_input === "GMT") {
            formatted_date = date.toGMTString();
        } else if ((lenIs1 && char0 === "6") || user_input === "UTM") {
            formatted_date = date.toUTCString();
        } else if ((lenIs1 && char0 === "7") || user_input === "ISO") {
            formatted_date = date.toISOString();
        } else {
            formatted_date = user_input;
        }
        datetime.innerHTML = formatted_date;
    }
}

function removeFile(fileN) {
    var file = document.getElementById("file-div-" + fileN);
    if (file != null) {
        file.remove();
    }
}

// text formatting function
function formatfile(file_name, content, front_crop, back_crop) {
    var output = "<strong>" + file_name + "</strong>";
    var line_n_len = Math.floor(Math.log10(content.length));
    for (var i = front_crop; i < content.length - back_crop; i++) {
        let line_number = i - front_crop + 1;
        output += "<br>" + "&nbsp;".repeat(line_n_len + 1 - line_number.toString().length) + line_number + "|    " + replace_leading_whitespaces_simple(replace_reserved(content[i]));
    }
    return output + "<br><br>"; //TODO: adjustable breaks between files.
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