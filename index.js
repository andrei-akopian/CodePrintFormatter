var output = "";

const Title = document.getElementById("page-title");
const Author = document.getElementById("author");
const datetime = document.getElementById("datetime");
const fileDisplay = document.getElementById("file-display");
const fileInput = document.getElementById("file-input");
const settings = document.getElementById("settings");
const tabSize = document.getElementById("tab-size");

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
            const fileContent = e.target.result;
            output += formatfile(file, fileContent);
            fileDisplay.innerHTML = output;
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
        date = Date();
    }
    datetime.innerHTML = date;
}


function formatfile(file, fileContent) {
    var mod = fileContent.split("\n");
    var output = "<strong>" + file.name + "</strong>";
    var line_n_len = Math.floor(Math.log10(mod.length));
    for (var i = 1; i <= mod.length; i++) {
        output += "<br>" + "&nbsp;".repeat(line_n_len + 1 - i.toString().length) + i + "|    " + replace_leading_whitespaces_simple(replace_reserved(mod[i - 1]));
    }
    return output + "<br><br>"; //TODO: adjustable breaks between spaces.
}

function resetFiles() {
    output = "";
    fileDisplay.innerHTML = "";
}

function replace_reserved(string) {
    return string.replace("<", "&lt;").replace(">", "&gt;");
}

function replace_leading_whitespaces_simple(string) {
    let whitespaces = string.match(/[\t\s]*/)[0];
    let len = whitespaces.length;
    string = whitespaces.replace(/\s/g, "&nbsp".repeat(tabSize.value)) + string.slice(len);
    return string;
}