import COMPILERS from "./compiler_list.js";





const compiler_dropdown_btn = document.getElementById("compiler-dropdown-btn");
const compiler_dropdown_btn_text = document.getElementById("compiler-dropdown-btn-text");
const compiler_dropdown_btn_chevron = document.getElementById("compiler-dropdown-btn-chevron");
const compiler_dropdown_content = document.getElementById("compiler-dropdown-content");

window.addEventListener("click", (e) => {
    if (e.target.closest("#compiler-dropdown")) { return; }

    compiler_dropdown_content.classList.remove("show");
    compiler_dropdown_btn_chevron.classList.remove("flipped");
});

compiler_dropdown_btn.addEventListener("click", () => {
    compiler_dropdown_content.classList.toggle("show");
    compiler_dropdown_btn_chevron.classList.toggle("flipped");
});

for (const name of COMPILERS.keys()) {
    const option = document.createElement("button");
    option.className = "compiler-dropdown-option";
    option.textContent = name;
    option.addEventListener("click", select_compiler);
    compiler_dropdown_content.appendChild(option);
}



const MIN_DT_MS = 100;
let live_compile_timeout;

const input_textarea = document.getElementById("input");

input_textarea.addEventListener("input", () => {
    if (live_btn.ariaPressed !== "true") return;

    clearTimeout(live_compile_timeout);
    live_compile_timeout = setTimeout(compile, MIN_DT_MS);
});

input_textarea.addEventListener("keydown", e => {
    if (e.key === "Tab") {
        e.preventDefault();
        input_textarea.setRangeText(
            "    ",
            input_textarea.selectionStart,
            input_textarea.selectionEnd,
            "end",
        );
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        clearTimeout(live_compile_timeout);
        compile();
    }
});


const live_btn = document.getElementById("live");
live_btn.addEventListener("click", () => {
    const pressed = live_btn.ariaPressed == "true" ? "false" : "true";
    live_btn.ariaPressed = pressed;

    if (pressed == "true") {
        clearTimeout(live_compile_timeout);
        compile();
    }
});


const outputElement = document.getElementById("output");

const copy_btn = document.getElementById("copy");
copy_btn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(outputElement.value);
});





const pyodide = await loadPyodide();

await pyodide.loadPackage("micropip");
const micropip = pyodide.pyimport("micropip");



for (const [name, compiler] of COMPILERS) {
    await micropip.install(`./${name}-0-py3-none-any.whl`);
    compiler.compile = compiler.load(pyodide);
}

let curr_compiler_name, curr_compiler;





document.getElementById("compiler-dropdown").style.display = "";
document.getElementById("editor").style.display = "";
document.getElementById("loading").style.display = "";



const compile_button = document.getElementById("compile");
compile_button.addEventListener("click", () => {
    clearTimeout(live_compile_timeout);
    compile();
});


function compile() {
    const src = document.getElementById("input").value;

    let text_color = "";
    let output;

    let copy_btn_bg_col = "";
    let copy_btn_border_col = "";
    let copy_btn_text = "Copy";
    try {
        output = curr_compiler?.compile?.(src);
        if (output === undefined) {
            output = "No compiler selected.";
            text_color = "#e57373";
        }
    } catch (error) {
        if (error instanceof pyodide.ffi.PythonError) {
            output = error.message;
            text_color = "#e57373";

            copy_btn_bg_col = "#eb5d5d";
            copy_btn_border_col = "#dc5050";
            copy_btn_text = "Copy Error"
        } else throw error;
    }

    outputElement.value = output;
    outputElement.style.color = text_color;

    copy_btn.style.backgroundColor = copy_btn_bg_col;
    copy_btn.style.borderColor = copy_btn_border_col;
    copy_btn.textContent = copy_btn_text;
}




const compiler_name_header_element = document.getElementById("compiler-name-header");
const compiler_src_link_element = document.getElementById("compiler-src-link");

function select_compiler(e) {
    const selected_option = e.target.closest(".compiler-dropdown-option");
    if (selected_option) {
        curr_compiler_name = selected_option.textContent;
        curr_compiler = COMPILERS.get(curr_compiler_name);

        compiler_name_header_element.textContent = curr_compiler_name;
        compiler_dropdown_btn_text.textContent = curr_compiler_name;

        compiler_src_link_element.href = curr_compiler.src_link;
    }
    compiler_dropdown_content.classList.remove("show");
    compiler_dropdown_btn_chevron.classList.remove("flipped");

    clearTimeout(live_compile_timeout);
    compile();
}
