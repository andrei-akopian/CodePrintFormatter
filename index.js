let fileCount = 0;

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

fontSize.addEventListener("change", (e) => {
    fileDisplay.style.fontSize = fontSize.value + "px";
});

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    processFile(file);
    fileInput.value = "";
});

function addFileToDisplay(fileContent) {
    let fileDisplayNode = document.createElement("div");
    fileDisplayNode.id = "file-display-" + fileCount;
    fileDisplayNode.innerHTML = fileContent;
    fileDisplay.appendChild(fileDisplayNode);
    fileCount += 1;
}

function processFile(file) {
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            const fileContent = e.target.result;
            addFileToDisplay(formatfile(file, fileContent));
        };
    }
}

function printFileOutput() {
    settings.style.display = "none";
    print();
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

function formatfile(file, fileContent) {
    var mod = fileContent.split("\n");
    var output = "<strong>" + file.name + "</strong>";
    var line_n_len = Math.floor(Math.log10(mod.length));
    for (var i = frontCrop.value; i < mod.length - backCrop.value; i++) {
        let line_number = i - frontCrop.value + 1;
        output += "<br>" + "&nbsp;".repeat(line_n_len + 1 - line_number.toString().length) + line_number + "|    " + replace_leading_whitespaces_simple(replace_reserved(mod[i]));
    }
    return output + "<br><br>"; //TODO: adjustable breaks between spaces.
}

function resetFiles() {
    output = "";
    fileDisplay.innerHTML = "";
}

function removeLastFile() {
    if (fileCount > 0) {
        fileCount -= 1;
        document.getElementById("file-display-" + fileCount).remove();
    }
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